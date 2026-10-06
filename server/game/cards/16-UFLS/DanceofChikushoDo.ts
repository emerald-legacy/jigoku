import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { handler, multiple } from '../../GameActions/GameActions.js';
import { Location } from '../../Constants.js';
import { GameModes } from '../../../GameModes.js';
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
            .effect('have {1} place 2 cards in each unbroken province they control', context => context.select)
            .max(AbilityDsl.limit.perRound(1));
    }

    fillProvinces(player: Player) {
        return handler({
            handler: () => {
                const unbrokenProvinces = this.getUnbrokenProvinces(player);
                unbrokenProvinces.forEach(province => {
                    this.game.queueSimpleStep(() => player.putTopDynastyCardInProvince(province, true));
                    this.game.queueSimpleStep(() => player.putTopDynastyCardInProvince(province, true));
                });
            }
        });
    }

    getUnbrokenProvinces(player: Player): Location[] {
        const unbrokenLocations: Location[] = [];
        const baseLocations = [Location.ProvinceOne, Location.ProvinceTwo, Location.ProvinceThree];
        if(this.game.gameMode !== GameModes.Skirmish) {
            baseLocations.push(Location.ProvinceFour);
        }
        baseLocations.forEach(p => {
            const province = player.getProvinceCardInProvince(p);
            if(province && !province.isBroken) {
                unbrokenLocations.push(p);
            }
        });

        return unbrokenLocations;
    }

}


export default DanceOfChikushoDo;
