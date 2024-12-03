
using API.DTOs.ResponseDTO;
using Microsoft.AspNetCore.Http;
using System.Text.Json;

namespace API.Utils.MiddleWare
{
    public class GlobalExceptionMiddleware : IMiddleware
    {
        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            try
            {
                await next(context);
            }
            catch (Exception e)
            {
                context.Response.StatusCode = 500;
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(
                    JsonSerializer.Serialize(new ResponseMessage
                    {
                        Success = false,
                        Data = null,
                        Message = "Internal Server Error",
                        StatusCode = 500
                    }));
            }
        }
    }
}
