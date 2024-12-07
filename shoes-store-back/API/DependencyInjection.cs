using API.Controllers;
using API.DAO;
using API.Data;
using API.Utils.MiddleWare;
using API.Utils.Ultils;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.OpenApi.Models;
using System.Text.Json.Serialization;
using WebAPI.Utils.Middlewares;

namespace API
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services)
        {
            services.AddScoped<AccountDAO>();
            services.AddScoped<AuthenticationDAO>();
            services.AddScoped<CartDAO>();
            services.AddScoped<ContactDAO>();
            services.AddScoped<NotificationDAO>();
            services.AddScoped<ProductDAO>();
            services.AddScoped<OrderDAO>();
            services.AddScoped<CommentDAO>();
            services.AddScoped<StatisticsDAO>();
            services.AddScoped<VariantDAO>();
            services.AddScoped<ImportDAO>();
            services.AddScoped<ExportDAO>();
            services.AddDbContext<ShoesDbContext>();
            services.AddScoped<Ultils>();
            services.AddAutoMapper(typeof(Program));

            return services;
        }

        public static IServiceCollection AddWebAPI(this IServiceCollection services)
        {
            services.AddControllers();
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();
            services.AddHttpContextAccessor();
            services.AddHostedService<NotificationBackgroundService>();
            services.AddScoped<GlobalExceptionMiddleware>();
            services.AddScoped<JWTAuthenticationMiddleware>();

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer();

            services.AddControllers().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
                options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
                options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.Never;
            });

            services.AddSwaggerGen(option =>
            {
                option.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Shoes Store",
                    Version = "v1"
                });

                option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    In = ParameterLocation.Header,
                    Description = "Valid Token is needed",
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    BearerFormat = "JWT",
                    Scheme = "Bearer"
                });

                option.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] { }
                    }
                });
            });
            return services;
        }
    }
}
