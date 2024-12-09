using System.Net.Mail;
using System.Net;
using System.Security.Cryptography;
using System.Text;

namespace API.Utils.Ultils
{
    public class Ultils
    {
        public static string SaveImage(IFormFile image, IWebHostEnvironment environment)
        {
            if (image == null || environment == null)
            {
                return null;
            }

            string uploadsFolder = Path.Combine(environment.ContentRootPath, "images");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }
            string uniqueFileName = "";
            if (image.FileName == null)
            {
                uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(image.Name);
            }
            uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(image.FileName);
            string filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                image.CopyTo(fileStream);
            }

            return "/images/" + uniqueFileName;
        }
        public static String RandomOTP()
        {
            Random random = new Random();
            int otpNumber = random.Next(1111, 9999);
            // Tạo mã OTP ngẫu nhiên
            string otp = otpNumber.ToString();
            return otp;
        }
        public static String sendMail(String toEmail,String content,String body)
        {
            string smtpServer = "smtp.gmail.com";
            int smtpPort = 587; 
            string smtpUsername = "huyltmce181964@fpt.edu.vn";
            string smtpPassword = "ohvimlkbgwsshwrh";
            
            using (SmtpClient client = new SmtpClient(smtpServer, smtpPort))
            {
                client.UseDefaultCredentials = false;
                client.Credentials = new NetworkCredential(smtpUsername, smtpPassword);
                client.EnableSsl = true;

                using (MailMessage mailMessage = new MailMessage())
                {
                    mailMessage.From = new MailAddress(smtpUsername);
                    mailMessage.To.Add(toEmail);
                    mailMessage.Subject = "Shoes Store";
                    mailMessage.Body = $"{body}: {content}";

                    client.Send(mailMessage);
                }

            }
            return content;
        }

        public static string GenerateRandomString()
        {
            int length = 16;
            const string prefix = "Shoes";
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            Random random = new Random();
            char[] stringChars = new char[length - prefix.Length];

            for (int i = 0; i < length - prefix.Length; i++)
            {
                stringChars[i] = chars[random.Next(chars.Length)];
            }


            return prefix + new string(stringChars);
        }

        public static string HashPassword(string password)
        {
            using (MD5 md5 = MD5.Create())
            {
                byte[] inputBytes = Encoding.ASCII.GetBytes(password);
                byte[] hashBytes = md5.ComputeHash(inputBytes);

                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < hashBytes.Length; i++)
                {
                    sb.Append(hashBytes[i].ToString("x2"));
                }

                return sb.ToString();
            }
        }

        public static string ReadPassword()
        {
            StringBuilder password = new StringBuilder();
            ConsoleKeyInfo keyInfo;

            do
            {
                keyInfo = Console.ReadKey(intercept: true);

                if (keyInfo.Key != ConsoleKey.Enter && keyInfo.Key != ConsoleKey.Backspace)
                {
                    password.Append(keyInfo.KeyChar);
                    Console.Write("*");
                }
                else if (keyInfo.Key == ConsoleKey.Backspace && password.Length > 0)
                {
                    password.Remove(password.Length - 1, 1);
                    Console.Write("\b \b");
                }
            } while (keyInfo.Key != ConsoleKey.Enter);

            Console.WriteLine();
            return password.ToString();
        }
    }
}
