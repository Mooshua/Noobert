# Noobert
An advanced roblox bot, for discord.

Noobert runs on a powerful core, with extensibility a priority. It uses MongoDB to store information about users, and AES to protect sensitive tokens.

## Features
### What we're working on:
 - **Ranking**: Promote/demote others through simple commands
 - **Announcements**: Create and publish some pretty cool stuff. Create your own Announcement pings automatically.
 - **Categories**: Give your friends some spicy roles with categories- like HR, MR, and LR, for groups of roles in a roblox group.

### What's coming:
 - **Music**: Sweet, sweet music commands. Play some jams in your favorite VC.
 - **Auto-mod**: Hate swear words with a passion? We'll filter them out for you.
 - **Leveling**: Give your regulars some sweet sweet rewards with Leveling.
 - **Giveaways**: Hate being rich? Be the ultimate robin hood with automatic robux giveaways.

## Technology
While optional, it is probably not a bad idea to be familiar with the subjects below before running your own server.

 - MongoDB
 - NodeJS + NPM
 - Discord.js

## Overview
 Noobert is a sharded Discord.js bot that is built from scratch. It has several primary components: 
  - The `roxxy` module is a custom class-based roblox wrapper, made just for Noobert
  - The command register, which is a simple way to extend the current palette of commands (register.js, core.js)

## Contributing
Noobert is always open to new friends! Please follow the CODE OF CONDUCT whenever working with Noobert's code.

# Documentation
Setup, runtime, etc is all documented in /docs/.