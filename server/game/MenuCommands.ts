import { Location } from './Constants.js';
import { Conflict } from './Conflict.js';
import type BaseCard from './BaseCard.js';
import type DrawCard from './DrawCard.js';
import type Game from './Game.js';
import ConflictFlow from './gamesteps/conflict/ConflictFlow.js';
import type Player from './Player.js';
import type { ProvinceCard } from './ProvinceCard.js';
import type Ring from './Ring.js';

type MenuItem = {
    command: string;
    text: string;
    arg: string;
    method: string;
};

export function cardMenuClick(menuItem: MenuItem, game: Game, player: Player, card: BaseCard) {
    switch(menuItem.command) {
        case 'bow':
            if(card.bowed) {
                game.addMessage('{0} readies {1}', player, card);
                card.ready();
            } else {
                game.addMessage('{0} bows {1}', player, card);
                card.bow();
            }
            return;
        case 'honor':
            game.addMessage('{0} honors {1}', player, card);
            card.honor();
            return;
        case 'dishonor':
            game.addMessage('{0} dishonors {1}', player, card);
            card.dishonor();
            return;
        case 'taint':
            if(card.isTainted) {
                game.addMessage('{0} cleanses {1}', player, card);
                card.untaint();
            } else {
                game.addMessage('{0} taints {1}', player, card);
                card.taint();
            }
            return;
        case 'addfate':
            game.addMessage('{0} adds a fate to {1}', player, card);
            (card as DrawCard).modifyFate(1);
            return;
        case 'remfate':
            game.addMessage('{0} removes a fate from {1}', player, card);
            (card as DrawCard).modifyFate(-1);
            return;
        case 'move':
            if(game.currentConflict) {
                const drawCard = card as DrawCard;
                if(drawCard.isParticipating()) {
                    game.addMessage('{0} moves {1} out of the conflict', player, card);
                    game.currentConflict.removeFromConflict(drawCard);
                } else {
                    game.addMessage('{0} moves {1} into the conflict', player, card);
                    if(card.controller.isAttackingPlayer()) {
                        game.currentConflict.addAttacker(drawCard);
                    } else if(card.controller.isDefendingPlayer()) {
                        game.currentConflict.addDefender(drawCard);
                    }
                }
            }
            return;
        case 'control':
            if(player.opponent) {
                game.addMessage('{0} gives {1} control of {2}', player, player.opponent, card);
                (card as DrawCard).setDefaultController(player.opponent);
            }
            return;
        case 'reveal':
            if(card.controller !== player) {
                return;
            }
            game.addMessage('{0} reveals {1}', player, card);
            card.facedown = false;
            return;
        case 'hide':
            if(card.controller !== player) {
                return;
            }
            game.addMessage('{0} flips {1} facedown', player, card);
            card.facedown = true;
            return;
        case 'break': {
            const province = card as ProvinceCard;
            game.addMessage('{0} {1} {2}', player, province.isBroken ? 'unbreaks' : 'breaks', card);
            province.isBroken = province.isBroken ? false : true;
            if(card.location === Location.StrongholdProvince && province.isBroken && player.opponent) {
                game.recordWinner(player.opponent, 'conquest');
            }
            return;
        }
        case 'move_conflict':
            game.addMessage('{0} moves the conflict to {1}', player, card);
            card.inConflict = true;
            if(game.currentConflict?.conflictProvince) {
                game.currentConflict.conflictProvince.inConflict = false;
                game.currentConflict.conflictProvince = card as ProvinceCard;
            }
            card.facedown = false;
            return;
        case 'refill':
            game.addMessage('{0} refills {1}', player, card.isFacedown() ? card.location : card);
            card.controller.replaceDynastyCard(card.location);
            return;
    }
}

export function ringMenuClick(menuItem: MenuItem, game: Game, player: Player, ring: Ring) {
    switch(menuItem.command) {
        case 'flip':
            if(game.currentConflict && game.currentConflict.ring) {
                game.addMessage('{0} switches the conflict type', player);
                game.currentConflict.switchType();
            } else {
                ring.flipConflictType();
            }
            return;
        case 'claim':
            game.addMessage('{0} claims the {1} ring', player, ring.element);
            ring.claimRing(player);
            return;
        case 'unclaimed':
            game.addMessage('{0} sets the {1} ring to unclaimed', player, ring.element);
            ring.resetRing();
            return;
        case 'contested':
            if(game.currentConflict) {
                if(!ring.claimed) {
                    game.addMessage('{0} switches the conflict to contest the {1} ring', player, ring.element);
                    game.currentConflict.switchElement(ring.element);
                } else {
                    game.addMessage(
                        '{0} tried to switch the conflict to contest the {1} ring, but it\'s already claimed',
                        player,
                        ring.element
                    );
                }
            }
            return;
        case 'addfate':
            game.addMessage('{0} adds a fate to the {1} ring', player, ring.element);
            ring.modifyFate(1);
            return;
        case 'remfate':
            game.addMessage('{0} removes a fate from the {1} ring', player, ring.element);
            ring.modifyFate(-1);
            return;
        case 'takefate':
            game.addMessage('{0} takes all the fate from the {1} ring and adds it to their pool', player, ring.element);
            player.modifyFate(ring.fate);
            ring.fate = 0;
            return;
        case 'conflict':
            if(game.currentActionWindow && game.currentActionWindow.windowName === 'preConflict') {
                game.addMessage('{0} initiates a conflict', player);
                const conflict = new Conflict(game, player, player.opponent as Player, ring);
                game.currentConflict = conflict;
                game.queueStep(new ConflictFlow(game, conflict));
                game.queueSimpleStep(() => (game.currentConflict = null));
            } else {
                game.addMessage(
                    '{0} tried to initiate a conflict, but game can only be done in a pre-conflict action window',
                    player
                );
            }
            return;
    }
}
