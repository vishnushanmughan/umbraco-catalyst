using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Umbraco.Catalyst.Services;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;

namespace Umbraco.Catalyst.Composers;

/// <summary>
/// Registers all Catalyst services with Umbraco's DI container.
/// This composer runs automatically on application startup.
/// No configuration in appsettings.json or Program.cs is required.
///
/// All DataEditor classes are discovered automatically by Umbraco
/// via the [DataEditor] attribute - they do not need manual registration.
/// All PropertyValueConverter classes are discovered automatically
/// via their IPropertyValueConverter implementation.
/// </summary>
public sealed class CatalystComposer : IComposer
{
    public void Compose(IUmbracoBuilder builder)
    {
        // ── Service Layer ────────────────────────────────────────────────
        // Scoped: one instance per HTTP request - correct for IContentService usage
        builder.Services.AddScoped<ICatalystContentService, CatalystContentService>();

        // ── Static Facade Initialisation ─────────────────────────────────
        // Resolves ICatalystContentService once the DI container is fully built
        // and hands it to the static Catalyst facade.
        builder.Services.AddHostedService<CatalystFacadeInitialiser>();
    }
}

/// <summary>
/// Hosted service that initialises the static Catalyst facade
/// after the DI container is fully built.
/// </summary>
internal sealed class CatalystFacadeInitialiser(IServiceProvider serviceProvider) : IHostedService
{
    public Task StartAsync(CancellationToken ct)
    {
        using var scope = serviceProvider.CreateScope();
        var service = scope.ServiceProvider.GetRequiredService<ICatalystContentService>();
        Catalyst.Initialise(service);
        return Task.CompletedTask;
    }

    public Task StopAsync(CancellationToken ct) => Task.CompletedTask;
}
