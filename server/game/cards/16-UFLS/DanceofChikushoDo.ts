import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { perRound } from '../../AbilityLimit.js';
import { fillProvince, multiple, multipleContext } from '../../GameActions/GameActions.js';
import { Location } from '../../Constants.js';
import type Player from '../../Player.js';
import { playerChoices } from '../playerChoices.js';

class DanceOfChikushoDo extends DrawCard {
    static id = 'dance-of-chikusho-do';

    setupCardAbilities() {
        this.action('Put cards into provinces')
            .selectFrom({
                targets: true,
                activePromptTitle: 'Choose any number of players'
            }, (context) => playerChoices(
                context.player,
                (player) => this.fillProvinces(player),
                (player, opponent) => multiple([
                    this.fillProvinces(player),
                    this.fillProvinces(opponent)
                ])
            ))
            .chatText((context) => msg`have ${context.select} place 2 cards in each unbroken province they control`)
            .max(perRound(1));
    }

    fillProvinces(player: Player) {
        return multipleContext(() => ({
            gameActions: this.getUnbrokenProvinces(player).map((location) => fillProvince({ target: player, location, amount: 2 }))
        }));
    }

    getUnbrokenProvinces(player: Player): Location[] {
        const unbrokenLocations: Location[] = [];
        const baseLocations = this.game.rules.setupNonStrongholdProvinces;
        baseLocations.forEach((p) => {
            const province = player.getProvinceCardInProvince(p);
            if(province && !province.isBroken) {
                unbrokenLocations.push(p);
            }
        });

        return unbrokenLocations;
    }

}


export default DanceOfChikushoDo;
