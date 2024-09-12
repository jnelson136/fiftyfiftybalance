using Microsoft.AspNetCore.SignalR;
using FiftyFifty;
public class ClickHub : Hub
{
    public async Task SendClickCounts(ClickCounts counts)
    {
        await Clients.All.SendAsync("RecieveClickCounts", counts);
    }
}