using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using FiftyFifty;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("CorsPolicy", builder =>
            {
                builder.AllowAnyMethod()
                       .AllowAnyHeader()
                       .AllowCredentials()
                       .SetIsOriginAllowed((host) => true)
                       .WithOrigins("https://fiftyfiftybalance-hpejhuf2h3gjbhba.westus-01.azurewebsites.net");
            });
        });

        builder.Services.AddSignalR();
        builder.Services.AddControllers();

        builder.Services.AddEndpointsApiExplorer();


        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseHttpsRedirection();
        app.UseRouting();
        app.UseCors("CorsPolicy");
        // app.UseAuthorization(); // Add if using authorization

        app.UseDefaultFiles(); // Looks for default files like index.html
        app.UseStaticFiles();  // Serves static files like HTML, CSS, and JS

        app.MapHub<ClickHub>("/clickHub");
        // app.MapGet("/", () => "Hello World!");
        app.MapControllers();

        app.Run();
    }
}
