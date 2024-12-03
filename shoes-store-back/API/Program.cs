using API;
using API.Utils.MiddleWare;
using Microsoft.Extensions.FileProviders;
using WebAPI.Utils.Middlewares;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;
var apiPolicy = "ShoesStorePolicy";

builder.Services.AddInfrastructure();
builder.Services.AddWebAPI();
builder.Services.AddCors(options =>
{
    options.AddPolicy(apiPolicy, policy =>
    {
        policy.AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(apiPolicy);
app.UseMiddleware<GlobalExceptionMiddleware>();
app.UseMiddleware<JWTAuthenticationMiddleware>();

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
    Path.Combine(Directory.GetCurrentDirectory(), "Images")),
    RequestPath = "/Images"
});

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
