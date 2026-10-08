import { msg } from '../../../GameChat.js';
import { CardType, Location, Players } from '../../../Constants.js';
import { perConflict } from '../../../AbilityLimit.js';
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
                            action: selectCard({
                                controller: Players.Self,
                                cardType: CardType.Character,
                                cardCondition: (card) => card.isCharacter() && card.isParticipating(),
                                message: (context, card, player) => msg`${player} moves home ${card} - they were an ${context.source}`,
                                gameAction: sendHome()
                            })
                        },
                        Done: { action: noAction() }
                    }
                })
            ]))
            .chatText('put {0} into play in the conflict')
            .max(perConflict(1))
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
