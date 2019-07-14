import asyncio
import requests
import discord
from discord.ext import commands
import time
import datetime

#<< << - variables - >> >>
separator = '|'

client = commands.Bot(command_prefix = ';')

monitored_players = {
    "18419223" : {"Name":"Malern", "LastMode":"offline", "Rank":"Special Agent in Charge"},
    "989886753" : {"Name":"AGENCY_0005", "LastMode":"offline", "Rank":"Advanced Special Agent"},
}

Colors = {
    'red' : 0xff2200,
    'yellow' : 0xF5FC14,
    'blue' : 0x7289DA,
    'black' : 0x23272A,
    'dark' : 0x2C2F33,
    'white' : 0xFFFFFF,
    'disc' : 0x36393f,
}

profile_classes = {
    "avatar-status game" : "in game",
    "avatar-status online" : "online",
}

status_colors = {
    'online' : Colors['blue'],
    'in game' : Colors['white'],
    'offline' : Colors['disc'],
}

async def embed_message(Channel, Title, Description, Color=Colors['yellow']):
    return await Channel.send(embed = discord.Embed(
        title = Title,
        type = 'rich',
        description = str(Description) + '\n\n*Developed & Maintained by Global Intelligence*\n**Overseeing Militia**',
        colour = Color,
        timestamp = datetime.datetime.now()
    ))

def get_user_status(get_return):
    for class_name in profile_classes:
        
        if get_return.find(class_name) > -1:
            status = profile_classes[class_name]
            return status
    
    return "offline"

async def check_profile(user_id):
    URL = f"https://www.roblox.com/users/{user_id}/profile"
    status = get_user_status(requests.get(url=URL).text)
    user_data = monitored_players[user_id]
    
    if not (status == user_data['LastMode']):
        user_data['LastMode'] = status
        await embed_message(client.get_channel(600084623694888973), user_data['Name'] + " is now " + status.upper(),
        "**" + user_data['Name']
        + "**\n\n**Status: **" + status
        + "\n**Rank:** " + user_data['Rank']
        + "\n\n**" + URL + "**", status_colors[status])

async def refresh_monitor():
    for user_id in monitored_players:
        await check_profile(user_id)
    
    time.sleep(15)

    await refresh_monitor()

@client.event
async def on_ready():
    await client.change_presence(activity=discord.Activity(name="Powered by Global Intelligence™", type=discord.ActivityType.watching))
    #await embed_message(client.get_channel(channel_id), 'Bot now functional', '**All systems are up and running**')
    #await refresh_monitor()

@client.event
async def on_message(message):
    await client.process_commands(message)

client.run("something_goes_here")
