import { changePlayerGloryModifier } from '../../../effects.js';
import { claimImperialFavor, multiple, putIntoPlay } from '../../../GameActions/GameActions.js';
import { CardType, FavorType, Location, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type Player from '../../../Player.js';

export default class WhispersOfTheLordsOfDeath extends DrawCard {
    static id = 'whispers-of-the-lords-of-death';

    public setupCardAbilities() {
        this.persistentEffect({
            targetController: Players.Any,
            effect: changePlayerGloryModifier((player) => this.highestMilitaryForPlayer(player))
        });

        this.reaction('Put into play')
            .when({
                onCardLeavesPlay: (event, context) =>
                    event.card.type === CardType.Character &&
                    event.cardStateWhenLeftPlay?.location === Location.PlayArea &&
                    context.game.isDuringConflict()
            })
            .gameAction(multiple([
                putIntoPlay((context) => ({ target: context.source })),
                claimImperialFavor((context) => ({
                    target: context.player,
                    side: FavorType.Military
                }))
            ]))
            .chatText('put {0} into play and claim the Imperial Favor')
            .location([Location.Hand]);
    }

    private highestMilitaryForPlayer(player: Player) {
        return player.cardsInPlay.reduce((maxMil, card) => {
            if(card.type !== CardType.Character) {
                return maxMil;
            }

            const cardMil = card.militarySkill;
            return cardMil > maxMil ? cardMil : maxMil;
        }, 0);
    }
}
