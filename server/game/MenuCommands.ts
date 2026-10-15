import { msg } from './GameChat.js';
import { Location } from './Constants.js';
import { Conflict } from './Conflict.js';
import type BaseCard from './BaseCard.js';
import type Game from './Game.js';
import { ConflictFlow } from './gamesteps/conflict/ConflictFlow.js';
import type Player from './Player.js';
import type Ring from './Ring.js';

export type MenuItem = {
    command: string;
    text?: string;
    arg?: string;
    method?: string;
};

export function cardMenuClick(menuItem: MenuItem, game: Game, player: Player, card: BaseCard) {
    switch(menuItem.command) {
        case 'bow':
            if(card.bowed) {
                game.addMessage(msg`${player} readies ${card}`);
                card.ready();
            } else {
                game.addMessage(msg`${player} bows ${card}`);
                card.bow();
            }
            return;
        case 'honor':
            game.addMessage(msg`${player} honors ${card}`);
            card.honor();
            return;
        case 'dishonor':
            game.addMessage(msg`${player} dishonors ${card}`);
            card.dishonor();
            return;
        case 'taint':
            if(card.isTainted) {
                game.addMessage(msg`${player} cleanses ${card}`);
                card.untaint();
            } else {
                game.addMessage(msg`${player} taints ${card}`);
                card.taint();
            }
            return;
        case 'addfate':
            if(!card.isDrawCard()) {
                return;
            }
            game.addMessage(msg`${player} adds a fate to ${card}`);
            card.modifyFate(1);
            return;
        case 'remfate':
            if(!card.isDrawCard()) {
                return;
            }
            game.addMessage(msg`${player} removes a fate from ${card}`);
            card.modifyFate(-1);
            return;
        case 'move':
            if(game.currentConflict && card.isDrawCard()) {
                if(card.isParticipating()) {
                    game.addMessage(msg`${player} moves ${card} out of the conflict`);
                    game.currentConflict.removeFromConflict(card);
                } else {
                    game.addMessage(msg`${player} moves ${card} into the conflict`);
                    if(card.controller.isAttackingPlayer()) {
                        game.currentConflict.addAttacker(card);
                    } else if(card.controller.isDefendingPlayer()) {
                        game.currentConflict.addDefender(card);
                    }
                }
            }
            return;
        case 'control':
            if(player.opponent && card.isDrawCard()) {
                game.addMessage(msg`${player} gives ${player.opponent} control of ${card}`);
                card.setDefaultController(player.opponent);
            }
            return;
        case 'reveal':
            if(card.controller !== player) {
                return;
            }
            game.addMessage(msg`${player} reveals ${card}`);
            card.facedown = false;
            return;
        case 'hide':
            if(card.controller !== player) {
                return;
            }
            game.addMessage(msg`${player} flips ${card} facedown`);
            card.facedown = true;
            return;
        case 'break':
            if(!card.isProvinceCard()) {
                return;
            }
            game.addMessage(msg`${player} ${card.isBroken ? 'unbreaks' : 'breaks'} ${card}`);
            card.isBroken = card.isBroken ? false : true;
            if(card.location === Location.StrongholdProvince && card.isBroken && player.opponent) {
                game.recordWinner(player.opponent, 'conquest');
            }
            return;
        case 'move_conflict':
            if(!card.isProvinceCard()) {
                return;
            }
            game.addMessage(msg`${player} moves the conflict to ${card}`);
            card.inConflict = true;
            if(game.currentConflict?.conflictProvince) {
                game.currentConflict.conflictProvince.inConflict = false;
                game.currentConflict.conflictProvince = card;
            }
            card.facedown = false;
            return;
        case 'refill':
            game.addMessage(msg`${player} refills ${card.isFacedown() ? card.location : card}`);
            card.controller.replaceDynastyCard(card.location);
            return;
    }
}

export function ringMenuClick(menuItem: MenuItem, game: Game, player: Player, ring: Ring) {
    switch(menuItem.command) {
        case 'flip':
            if(game.currentConflict && game.currentConflict.ring) {
                game.addMessage(msg`${player} switches the conflict type`);
                game.currentConflict.switchType();
            } else {
                ring.flipConflictType();
            }
            return;
        case 'claim':
            game.addMessage(msg`${player} claims the ${ring.element} ring`);
            ring.claimRing(player);
            return;
        case 'unclaimed':
            game.addMessage(msg`${player} sets the ${ring.element} ring to unclaimed`);
            ring.resetRing();
            return;
        case 'contested':
            if(game.currentConflict) {
                if(!ring.claimed) {
                    game.addMessage(msg`${player} switches the conflict to contest the ${ring.element} ring`);
                    game.currentConflict.switchElement(ring.element);
                } else {
                    game.addMessage(msg`${player} tried to switch the conflict to contest the ${ring.element} ring, but it's already claimed`);
                }
            }
            return;
        case 'addfate':
            game.addMessage(msg`${player} adds a fate to the ${ring.element} ring`);
            ring.modifyFate(1);
            return;
        case 'remfate':
            game.addMessage(msg`${player} removes a fate from the ${ring.element} ring`);
            ring.modifyFate(-1);
            return;
        case 'takefate':
            game.addMessage(msg`${player} takes all the fate from the ${ring.element} ring and adds it to their pool`);
            player.modifyFate(ring.fate);
            ring.fate = 0;
            return;
        case 'conflict':
            if(game.currentActionWindow && game.currentActionWindow.windowName === 'preConflict') {
                game.addMessage(msg`${player} initiates a conflict`);
                const conflict = new Conflict(game, player, player.opponent, ring);
                game.currentConflict = conflict;
                game.queueStep(new ConflictFlow(game, conflict));
                game.queueSimpleStep(() => (game.currentConflict = null));
            } else {
                game.addMessage(msg`${player} tried to initiate a conflict, but game can only be done in a pre-conflict action window`);
            }
            return;
    }
}
