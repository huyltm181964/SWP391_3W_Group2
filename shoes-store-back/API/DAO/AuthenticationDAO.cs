using API.Data;
using API.DTOs.RequestDTO;
using API.DTOs.ResponseDTO;
using API.Models;
using API.Utils;
using API.Utils.Ultils;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using System.Net;

namespace API.DAO
{
    public class AuthenticationDAO
    {
        private readonly ShoesDbContext db;
        private readonly IConfiguration configuration;
        private readonly IMapper map;
        private readonly IWebHostEnvironment env;
        public AuthenticationDAO(ShoesDbContext db, IConfiguration _configuration, IMapper _mapper, IWebHostEnvironment _env)
        {
            this.db = db;
            this.configuration = _configuration;
            this.map = _mapper;
            this.env = _env;
        }

        public ResponseMessage Login(String Email, String Password)
        {
            string secretkey = configuration["JWT:SecretKey"];
            var checkLogin = db.Account.FirstOrDefault(x => x.AccountEmail.Equals(Email) && x.Password.Equals(Password));
            if (checkLogin == null)
            {
                return new ResponseMessage
                {
                    Success = false,
                    Message = "Invalid email or password",
                    Data = { },
                    StatusCode = (int)HttpStatusCode.BadRequest
                };
            }

            String token = JWTHandler.GenerateJWT(checkLogin, secretkey);
            return new ResponseMessage
            {
                Success = true,
                Message = "Success",
                Data = new { token = token, Role = checkLogin.Role, Status = checkLogin.Status },
                StatusCode = (int)HttpStatusCode.OK
            };
        }

        public ResponseMessage LoginWithGoogle(LoginGoogleDTO loginGoogleDTO)
        {
            string secretkey = configuration["JWT:SecretKey"];
            var account = db.Account.FirstOrDefault(x => x.AccountEmail == loginGoogleDTO.Email);
            if (account == null)
            {
                var cart = new Cart
                {
                    TotalPrice = 0,
                };
                db.Cart.Add(cart);

                account = new Account
                {
                    AccountEmail = loginGoogleDTO.Email,
                    AccountName = loginGoogleDTO.Name,
                    Password = Ultils.GenerateRandomString(),
                    Role = "User",
                    CreatedAt = DateTime.Now,
                    Cart = cart,
                    Status = "Active"
                };
                db.Account.Add(account);

                db.SaveChanges();
            }

            String token = JWTHandler.GenerateJWT(account, secretkey);
            return new ResponseMessage
            {
                Success = true,
                Message = "Success",
                Data = new { token = token, Role = account.Role, Status = account.Status },
                StatusCode = (int)HttpStatusCode.OK
            };
        }

        public ResponseMessage Register(RegisterDTO register)
        {
            if (string.IsNullOrWhiteSpace(register.AccountEmail) || string.IsNullOrWhiteSpace(register.Password))
            {
                return null;
            }
            var checkAlreadyEmail = db.Account
                                      .FirstOrDefault(x => x.AccountEmail.Equals(register.AccountEmail));
            if (checkAlreadyEmail != null)
            {
                return new ResponseMessage
                {
                    Success = false,
                    Message = "Email Already Exist",
                    Data = checkAlreadyEmail.AccountEmail,
                    StatusCode = (int)HttpStatusCode.Conflict
                };
            }
            Cart createCart = new Cart
            {
                TotalPrice = 0,

            };
            db.Cart.Add(createCart);
            Account registerAccount = new Account
            {
                AccountEmail = register.AccountEmail.ToLower(),
                Password = register.Password,
                AccountName = register.AccountName,
                Phone = register.Phone,
                Role = register.Role,
                Status = register.Status,
                CreatedAt = DateTime.Now,
                Cart = createCart,
                CartID = createCart.CartID
            };

            db.Account.Add(registerAccount);
            db.SaveChanges();

            var resultDto = map.Map<RegisterDTO>(registerAccount);

            return new ResponseMessage
            {
                Success = true,
                Message = "Register Successfully",
                Data = new
                {
                    Data = resultDto
                },
                StatusCode = (int)HttpStatusCode.OK
            };
        }

        public ResponseMessage ActiveAccount(string accountEmail)
        {
            var getAccount = db.Account.FirstOrDefault(x => x.AccountEmail == accountEmail);
            if (getAccount != null)
            {
                getAccount.Status = "Active";
                db.Account.Update(getAccount);
                db.SaveChanges();
                return new ResponseMessage
                {
                    Success = true,
                    Message = "Success",
                    Data = getAccount,
                    StatusCode = (int)HttpStatusCode.OK
                };
            }
            return new ResponseMessage
            {
                Success = false,
                Message = "Data Not Found",
                Data = getAccount,
                StatusCode = (int)HttpStatusCode.NotFound
            };
        }



        public ResponseMessage ForgotPassword(String AccountEmail)
        {
            var getAccount = db.Account.FirstOrDefault(x => x.AccountEmail.Equals(AccountEmail.ToLower()));
            if (getAccount == null)
            {
                return new ResponseMessage
                {
                    Success = false,
                    Message = "Account not found",
                    Data = new int[0],
                    StatusCode = (int)HttpStatusCode.NotFound,
                };
            }
            String fakePassword = Ultils.GenerateRandomString();
            getAccount.Password = fakePassword;
            db.Account.Update(getAccount);
            db.SaveChanges();
            Ultils.sendMail(AccountEmail, fakePassword, "Use this code to update");
            return new ResponseMessage
            {
                Success = true,
                Message = "Success",
                Data = AccountEmail,
                StatusCode = (int)HttpStatusCode.OK,
            };
        }

        public ResponseMessage GetAll<T>(params Expression<Func<T, object>>[] includeExpressions) where T : class
        {
            IQueryable<T> query = db.Set<T>();
            foreach (var includeExpression in includeExpressions)
            {
                query = query.Include(includeExpression);
            }
            var result = query.ToList();
            return new ResponseMessage
            {
                Success = true,
                Message = "Success",
                Data = map.Map<List<T>>(result),
                StatusCode = (int)HttpStatusCode.OK,

            };
        }

        //Doc ten ham
        public ResponseMessage GetAllAccount()
        {
            // Lấy account list với role là "User"
            var listAccount = db.Account.Where(x => x.Role.Equals("User")).ToList();

            // Nếu có tài khoản, trả về thành công.
            if (listAccount.Any())
            {
                return new ResponseMessage
                {
                    Success = true,
                    Message = "Success",
                    Data = map.Map<List<AccountResponse>>(listAccount),
                    StatusCode = (int)HttpStatusCode.OK,
                };
            }

            // Nếu không có tài khoản, trả về không tìm thấy.
            return new ResponseMessage
            {
                Success = false,
                Message = "Not Found",
                Data = map.Map<List<AccountResponse>>(listAccount),
                StatusCode = (int)HttpStatusCode.NotFound,
            };
        }

        //Lấy tất cả account list với role là "Staff"
        public ResponseMessage GetAllStaff()
        {
            // Lấy account list với role là "Staff"
            var listAccount = db.Account.Where(x => x.Role.Equals("Staff")).ToList();
            // Nếu có account thì trả về kết quả thành công.
            if (listAccount.Any())
            {
                return new ResponseMessage
                {
                    Success = true,
                    Message = "Success",
                    Data = map.Map<List<AccountResponse>>(listAccount),
                    StatusCode = (int)HttpStatusCode.OK,
                };
            }

            // Nếu không tìm thấy tài khoản nào thì not found
            return new ResponseMessage
            {
                Success = false,
                Message = "Not Found",
                Data = map.Map<List<AccountResponse>>(listAccount),
                StatusCode = (int)HttpStatusCode.NotFound,
            };
        }

       //Thêm account cho staff
        public ResponseMessage AddStaff(AddStaffDTO addStaffDTO)
        {
            // Kiểm tra đầu vào
            if (addStaffDTO == null)
            {
                return new ResponseMessage
                {
                    Success = false,
                    Message = "Bad Request",
                    Data = addStaffDTO, 
                    StatusCode = (int)HttpStatusCode.BadRequest
                };
            }

            // Kiểm tra mail với account có rỗng hay ko
            if (string.IsNullOrWhiteSpace(addStaffDTO.AccountEmail) || string.IsNullOrWhiteSpace(addStaffDTO.Password))
            {
                return new ResponseMessage
                {
                    Success = false, 
                    Message = "Account email and password are required.", 
                    StatusCode = (int)HttpStatusCode.BadRequest 
                };
            }

            // Kiểm tra existed mail
            var existingAccount = db.Account.FirstOrDefault(x => x.AccountEmail == addStaffDTO.AccountEmail);
            if (existingAccount != null)
            {
                return new ResponseMessage
                {
                    Success = false, 
                    Message = "Email already exists",
                    Data = existingAccount.AccountEmail,
                    StatusCode = (int)HttpStatusCode.Conflict 
                };
            }

            // Tạo giỏ hàng cho tài khoản mới.
            var cart = new Cart
            {
                TotalPrice = 0 
            };
            db.Cart.Add(cart); 

            // Lưu ảnh đại diện 
            var imageUrl = Ultils.SaveImage(addStaffDTO.Avatar, env);

            // Tạo tài khoản mới.
            var newAccount = new Account
            {
                Avatar = imageUrl,
                AccountName = addStaffDTO.AccountName,
                AccountEmail = addStaffDTO.AccountEmail,
                Password = addStaffDTO.Password,
                AccountAddress = addStaffDTO.AccountAddress,
                BirthDay = addStaffDTO.Birthday,
                Phone = addStaffDTO.Phone,
                Gender = addStaffDTO.Gender,
                Role = addStaffDTO.Role,
                Status = addStaffDTO.Status,
                CreatedAt = DateTime.Now, 
                Cart = cart,
                CartID = cart.CartID
            };

            db.Account.Add(newAccount);
            db.SaveChanges(); 

            return new ResponseMessage
            {
                Success = true, 
                Message = "Success", 
                Data = map.Map<AccountResponse>(newAccount),
                StatusCode = (int)HttpStatusCode.OK 
            };
        }

        //Update status cho một account (Active hoặc Block)
        public ResponseMessage UpdateAccountStatus(string accountEmail)
        {
            // Tìm tài khoản theo email.
            var getAccount = db.Account.FirstOrDefault(x => x.AccountEmail.Equals(accountEmail));

            //Ko tìm thấy => lỗi
            if (getAccount == null)
            {
                return new ResponseMessage
                {
                    Success = false,
                    Message = "Data not found",
                    Data = Array.Empty<int>(),
                    StatusCode = (int)HttpStatusCode.NotFound,
                };
            }

            // Đổi trạng thái tài khoản. nếu status là active thì sẽ chuyển sang block and vice versa
            getAccount.Status = getAccount.Status == "Active" ? "Blocked" : "Active";
            db.Account.Update(getAccount);  
            db.SaveChanges();  

            // Trả về kết quả thành công.
            return new ResponseMessage
            {
                Success = true,
                Message = "Success",
                Data = map.Map<AccountResponse>(getAccount),
                StatusCode = (int)HttpStatusCode.OK,
            };
        }


        //Cập nhật những thông tin cơ bản của staff
        public ResponseMessage UpdateStaffInformation(UpdateStaffDTO updateStaffDTO)
        {
            // Tìm tài khoản theo ID.
            var account = db.Account.FirstOrDefault(x => x.AccountID == updateStaffDTO.AccountID);

            //Nếu account rỗng hoặc role là admin hay user thì lỗi
            if (account == null || account.Role is "Admin" or "User")
            {
                return new ResponseMessage
                {
                    Success = false,
                    Message = "Data not found", 
                    Data = Array.Empty<int>(), 
                    StatusCode = (int)HttpStatusCode.NotFound 
                };
            }

            account.Avatar = updateStaffDTO.Avatar != null
                ? Ultils.SaveImage(updateStaffDTO.Avatar, env) // Lưu ảnh đại diện mới 
                : account.Avatar; // Giữ nguyên ảnh đại diện cũ nếu không thay đổi.
            account.AccountEmail = updateStaffDTO.AccountEmail;
            account.AccountName = updateStaffDTO.AccountName;
            account.Gender = updateStaffDTO.Gender;
            account.BirthDay = updateStaffDTO.Birthday;
            account.Phone = updateStaffDTO.Phone;
            account.AccountAddress = updateStaffDTO.AccountAddress;

            db.Account.Update(account); 
            db.SaveChanges(); 

            return new ResponseMessage
            {
                Success = true, 
                Message = "Success",
                Data = map.Map<AccountResponse>(account), 
                StatusCode = (int)HttpStatusCode.OK 
            };
        }
    }
}
