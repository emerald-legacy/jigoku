import DrawCard from '../../drawcard.js';
import { Locations, Players, TargetModes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class DaidojiHarrier extends DrawCard {
    static id = 'daidoji-harrier';

    setupCardAbilities() {
        this.reaction({
            title: 'Discard an opponent\'s card',
            when: {
                afterConflict: (event, context) => context.source.isParticipating() &&
                                                    event.conflict.winner === context.source.controller &&
                                                    context.player.opponent && event.conflict.conflictType === 'military'
            },
            target: {
                activePromptTitle: 'Choose two cards to reveal',
                player: Players.Opponent,
                numCards: 2,
                mode: TargetModes.Exactly,
                location: Locations.Hand
            },
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.lookAt(context => ({
                    target: context.target
                })),
                AbilityDsl.actions.cardMenu(context => ({
                    cards: context.target,
                    gameAction: AbilityDsl.actions.discardCard(),
                    message: '{0} chooses {1} to be discarded',
                    messageArgs: (card, player) => [player, card]
                }))
            ])
        });
    }
}


export default DaidojiHarrier;
