import { cardCannot, mustBeDeclaredAsAttacker } from '../../../effects.js';
import { cardLastingEffect, initiateConflict, ready, sequentialContext } from '../../../GameActions/GameActions.js';
import { CardType, Location } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class ScoutsSteed extends DrawCard {
    static id = 'scout-s-steed';

    public setupCardAbilities() {
        this.attachmentConditions({ myControl: true });

        this.reaction('Call your steed and go out to explore')
            .when({
                onCardPlayed: (event, context) => event.card === context.source
            })
            .target({
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card, context) => card.isFacedown() && card.canBeAttacked() && card.controller !== context.player
            })
            .gameAction(sequentialContext(
                ({ player, target: province, source: { parentCharacter: character } }) => ({
                    gameActions: [
                        ready({ target: character ?? [] }),
                        cardLastingEffect({
                            target: character ?? [],
                            effect: mustBeDeclaredAsAttacker()
                        }),
                        cardLastingEffect({
                            target: province,
                            targetLocation: Location.Provinces,
                            effect: cardCannot('break')
                        }),
                        initiateConflict({
                            target: player,
                            forceProvinceTarget: province,
                            canPass: false
                        })
                    ]
                })
            ))
            .effect('ready {1} and send them on a journey! {2} cannot be broken during this conflict - it\'s just exploration for now', (context) => {
                const target = context.target;
                return [
                    context.source.parentCharacter,
                    target.isFacedown() ? target.location : target
                ];
            });
    }
}
