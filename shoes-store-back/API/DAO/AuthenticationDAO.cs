using API.Data;
using API.DTOs.RequestDTO;
using API.DTOs.ResponseDTO;
using API.Models;
using API.Utils;
using API.Utils.Ultils;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using System.Linq.Expressions;
using System.Net;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

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
        public ResponseMessage GetAllAccount()
        {
            var listAccount = db.Account.Where(x => !x.Role.Equals("Admin")).ToList();
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

            return new ResponseMessage
            {
                Success = false,
                Message = "Not Found",
                Data = map.Map<List<AccountResponse>>(listAccount),
                StatusCode = (int)HttpStatusCode.NotFound,
            };
        }

        public ResponseMessage UpdateAccountStatus(String accountEmail)
        {
            var getAccount = db.Account.FirstOrDefault(x => x.AccountEmail.Equals(accountEmail));
            if (getAccount != null && getAccount.Status.Equals("Active"))
            {
                getAccount.Status = "Blocked";
                db.Account.Update(getAccount);

            }
            else if (getAccount.Status.Equals("Blocked"))
            {
                getAccount.Status = "Active";
                db.Account.Update(getAccount);

            }

            db.SaveChanges();
            return new ResponseMessage
            {
                Success = true,
                Message = "Success",
                Data = map.Map<AccountResponse>(getAccount),
                StatusCode = (int)HttpStatusCode.OK
            };
        }
    }
}
