import { CardType, Location, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import {
    chooseAction,
    multiple,
    noAction,
    putIntoConflict,
    returnToHand,
    selectCard,
    sendHome
} from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { controlsShugenja } from '../../controlsShugenja.js';

export default class IllusionaryDecoy extends DrawCard {
    static id = 'illusionary-decoy';

    public setupCardAbilities() {
        this.reaction('Put into play')
            .when({
                onConflictStarted: (_event, context) => controlsShugenja(context.player)
            })
            .gameAction(multiple([
                putIntoConflict((context) => ({ target: context.source })),
                chooseAction({
                    options: {
                        'Move another of your characters home': {
                            action: selectCard((context) => ({
                                controller: Players.Self,
                                cardType: CardType.Character,
                                cardCondition: (card) => card.isCharacter() && card.isParticipating(),
                                message: '{0} moves home {1} - they were an {2}',
                                messageArgs: (card, player) => [player, card, context.source],
                                gameAction: sendHome()
                            }))
                        },
                        Done: { action: noAction() }
                    }
                })
            ]))
            .effect('put {0} into play in the conflict')
            .max(AbilityDsl.limit.perConflict(1))
            .location(Location.Hand);

        this.action('Return to hand')
            .condition((context) => {
                const claimedRings = context.source.controller.getClaimedRings();
                const matchShugenjaElementWithClaimedRing = context.source.controller.cardsInPlay.some(
                    (card) =>
                        card.getType() === CardType.Character &&
                        card.hasTrait('shugenja') &&
                        claimedRings.some((ring) =>
                            ring.getElements().some((element) => card.hasTrait(element))
                        )
                );
                return matchShugenjaElementWithClaimedRing;
            })
            .gameAction(returnToHand());
    }
}
