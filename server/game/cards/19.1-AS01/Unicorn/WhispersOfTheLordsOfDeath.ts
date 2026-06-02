import AbilityDsl from '../../../abilitydsl.js';
import { CardType, FavorType, Location, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type Player from '../../../Player.js';

export default class WhispersOfTheLordsOfDeath extends DrawCard {
    static id = 'whispers-of-the-lords-of-death';

    public setupCardAbilities() {
        this.persistentEffect({
            targetController: Players.Any,
            effect: AbilityDsl.effects.changePlayerGloryModifier((player: Player) => this.highestMilitaryForPlayer(player))
        });

        this.reaction({
            title: 'Put into play',
            location: [Location.Hand],
            when: {
                onCardLeavesPlay: (event, context) =>
                    event.card.type === CardType.Character &&
                    event.cardStateWhenLeftPlay?.location === Location.PlayArea &&
                    context.game.isDuringConflict()
            },
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.putIntoPlay((context) => ({ target: context.source })),
                AbilityDsl.actions.claimImperialFavor((context) => ({
                    target: context.player,
                    side: FavorType.Military
                }))
            ]),
            effect: 'put {0} into play and claim the Imperial Favor'
        });
    }

    private highestMilitaryForPlayer(player: Player) {
        return player.cardsInPlay.reduce((maxMil, card) => {
            if(card.type !== CardType.Character) {
                return maxMil;
            }

            const cardMil = card.getMilitarySkill();
            return cardMil > maxMil ? cardMil : maxMil;
        }, 0);
    }
}
