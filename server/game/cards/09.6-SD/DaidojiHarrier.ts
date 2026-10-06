import DrawCard from '../../DrawCard.js';
import { Location, Players, TargetMode, ConflictType } from '../../Constants.js';
import { cardMenu, discardCard, lookAt, multiple } from '../../GameActions/GameActions.js';

class DaidojiHarrier extends DrawCard {
    static id = 'daidoji-harrier';

    setupCardAbilities() {
        this.reaction('Discard an opponent\'s card')
            .when({
                afterConflict: (event, context) => context.source.isParticipating() &&
                                                    event.conflict.winner === context.source.controller &&
                                                    context.player.opponent && event.conflict.conflictType === ConflictType.Military
            })
            .targetCards({
                activePromptTitle: 'Choose two cards to reveal',
                player: Players.Opponent,
                numCards: 2,
                mode: TargetMode.Exactly,
                location: Location.Hand
            })
            .gameAction(multiple([
                lookAt(context => ({
                    target: context.targets.target
                })),
                cardMenu(context => ({
                    cards: context.targets.target.filter((card) => card.isDrawCard()),
                    gameAction: discardCard(),
                    message: '{0} chooses {1} to be discarded',
                    messageArgs: (card, player) => [player, card]
                }))
            ]));
    }
}


export default DaidojiHarrier;
