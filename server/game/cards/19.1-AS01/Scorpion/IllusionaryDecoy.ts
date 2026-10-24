import { msg } from '../../../GameChat.js';
import { CardType, Location, Players, Trait, elementTrait } from '../../../Constants.js';
import { perConflict } from '../../../AbilityLimit.js';
import {
    noAction,
    selectCard,
    sendHome
} from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { controlsShugenja } from '../../controlsShugenja.js';

export default class IllusionaryDecoy extends DrawCard {
    static id = 'illusionary-decoy';

    public override setupCardAbilities() {
        this.reaction('Put into play')
            .when({
                onConflictStarted: (_event, context) => controlsShugenja(context.player)
            })
            .location(Location.Hand)
            .putIntoConflict()
            .chooseAction({
                choices: {
                    'Move another of your characters home': selectCard({
                        controller: Players.Self,
                        cardType: CardType.Character,
                        cardCondition: (card) => card.isCharacter() && card.isParticipating(),
                        message: (context, card, player) => msg`${player} moves home ${card} - they were an ${context.source}`,
                        gameAction: sendHome()
                    }),
                    Done: noAction()
                }
            })
            .chatText('put {0} into play in the conflict')
            .max(perConflict(1));

        this.action('Return to hand')
            .ifCondition((context) => {
                const claimedRings = context.source.controller.getClaimedRings();
                const matchShugenjaElementWithClaimedRing = context.source.controller.cardsInPlay.some(
                    (card) =>
                        card.type === CardType.Character &&
                        card.hasTrait(Trait.Shugenja) &&
                        claimedRings.some((ring) =>
                            ring.getElements().some((element) => card.hasTrait(elementTrait(element)))
                        )
                );
                return matchShugenjaElementWithClaimedRing;
            })
            .returnToHand();
    }
}
