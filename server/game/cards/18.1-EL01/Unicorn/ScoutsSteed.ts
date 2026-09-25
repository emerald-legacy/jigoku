import AbilityDsl from '../../../abilitydsl.js';
import { CardType, Duration, Location } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class ScoutsSteed extends DrawCard {
    static id = 'scout-s-steed';

    public setupCardAbilities() {
        this.attachmentConditions({ myControl: true });

        this.reaction('Call your steed and go out to explore!')
            .when({
                onCardPlayed: (event, context) => event.card === context.source
            })
            .target('target', {
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card, context) => card.isFacedown() && (card).canBeAttacked() && card.controller !== context.player
            })
            .gameAction(AbilityDsl.actions.sequentialContext(
                ({ player, target: province, source: { parentCharacter: character } }) => ({
                    gameActions: [
                        AbilityDsl.actions.ready({ target: character ?? [] }),
                        AbilityDsl.actions.cardLastingEffect({
                            target: character ?? [],
                            effect: AbilityDsl.effects.mustBeDeclaredAsAttacker(),
                            duration: Duration.UntilEndOfConflict
                        }),
                        AbilityDsl.actions.cardLastingEffect(() => ({
                            target: province,
                            targetLocation: Location.Provinces,
                            effect: AbilityDsl.effects.cardCannot('break'),
                            duration: Duration.UntilEndOfConflict
                        })),
                        AbilityDsl.actions.initiateConflict({
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
                    target && target.isFacedown() ? target.location : target ?? ''
                ];
            });
    }
}
