using API.Data;
using API.DTOs.RequestDTO;
using API.DTOs.ResponseDTO;
using API.Utils.Ultils;
using AutoMapper;
using System.Net;

namespace API.DAO
{
    public class AccountDAO
    {
        private readonly ShoesDbContext db;
        private readonly IConfiguration configuration;
        private readonly IMapper map;
        private readonly IWebHostEnvironment env;
        public AccountDAO(ShoesDbContext db, IConfiguration _configuration, IMapper _mapper, IWebHostEnvironment _env)
        {
            this.db = db;
            this.configuration = _configuration;
            this.map = _mapper;
            this.env = _env;
        }

        public ResponseMessage GetProfileByID(int accountID)
        {
            var getProfile = db.Account
                               .FirstOrDefault(x => x.AccountID == accountID);

            return new ResponseMessage
            {
                Success = true,
                Data = getProfile,
                StatusCode = (int)HttpStatusCode.OK,
                Message = "Success"
            };
        }

        public ResponseMessage ChangePassword(int userID, ChangePasswordDTO changePassword)
        {
            var getAccount = db.Account
                               .FirstOrDefault(x => x.AccountID == userID);
            if (getAccount.Password != changePassword.OldPassword)
            {
                return new ResponseMessage
                {
                    Success = false,
                    Data = null,
                    Message = "Incorrect Password",
                    StatusCode = (int)HttpStatusCode.BadRequest
                };
            }
            getAccount.Password = changePassword.NewPassword;
            db.Account.Update(getAccount);
            db.SaveChanges();
            var updateDTO = map.Map<ChangePasswordDTO>(getAccount);
            updateDTO.NewPassword = getAccount.Password;
            return new ResponseMessage
            {
                Success = true,
                Data = updateDTO,
                Message = "Success",
                StatusCode = (int)HttpStatusCode.OK
            };
        }

        public ResponseMessage UpdateProfile(int id, ProfileDTO profileDTO)
        {
            var getUser = db.Account.FirstOrDefault(x => x.AccountID == id);
            var saveImage = Ultils.SaveImage(profileDTO.Avatar, env);
            if (getUser != null)
            {
                getUser.Avatar = saveImage ?? getUser.Avatar;
                getUser.AccountAddress = profileDTO.AccountAddress ?? getUser.AccountAddress;
                getUser.AccountName = profileDTO.AccountName ?? getUser.AccountName;
                getUser.BirthDay = DateTime.TryParse(profileDTO.BirthDay, out var parsedDate) ? parsedDate : getUser.BirthDay;
                getUser.Gender = profileDTO.Gender ?? getUser.Gender;
                getUser.Phone = profileDTO.Phone ?? getUser.Phone;
                getUser.AccountAddress = profileDTO.AccountAddress ?? getUser.AccountAddress;
                db.Account.Update(getUser);
                db.SaveChanges();
                return new ResponseMessage
                {
                    Success = true,
                    Message = "Update Successfully",
                    Data = map.Map<ProfileResponse>(getUser),
                    StatusCode = (int)HttpStatusCode.OK,
                };
            }
            return new ResponseMessage
            {
                Success = false,
                Message = "Account Not Found",
                Data = new int[0],
                StatusCode = (int)HttpStatusCode.NotFound,
            };
        }
    }
}
