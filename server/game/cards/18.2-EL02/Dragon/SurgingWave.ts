import { msg } from '../../../GameChat.js';
import DrawCard from '../../../DrawCard.js';
import { doesNotBow } from '../../../effects.js';
import {
    atEndOfConflict,
    cardLastingEffect,
    discardStatusToken,
    joint,
    loseFate,
    optional,
    sequential
} from '../../../GameActions/GameActions.js';
import { CardType, Players, Trait } from '../../../Constants.js';

class SurgingWave extends DrawCard {
    static id = 'surging-wave';

    override setupCardAbilities() {
        this.conflictAction('Prevent bowing after conflict')
            .target({
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card) => card.isParticipating() && card.hasTrait(Trait.Monk)
            }, sequential((context) => {
                const kihoPlayed = context.player.isKihoPlayedThisConflict(context, this);
                const gameActions = [];
                gameActions.push(
                    atEndOfConflict(() => ({
                        message: () => msg`${context.target.statusTokens} ${context.target.statusTokens.length > 1 ? 'are' : 'is'} removed from ${context.target} due to the delayed effect of ${context.source}`,
                        gameAction: discardStatusToken(() => ({
                            target: context.target.statusTokens
                        }))
                    }))
                );
                if(kihoPlayed) {
                    gameActions.push(
                        optional({
                            activePromptTitle:
                                    'Spend 1 fate to prevent ' +
                                    context.target.name +
                                    ' from bowing at the end of the conflict?',
                            acceptMessage: () => msg`${context.player} chooses to spend a fate to prevent ${context.target} from bowing during conflict resolution`,
                            declineMessage: () => msg`${context.player} chooses not to spend a fate to prevent ${context.target} from bowing during conflict resolution`,
                            gameAction: joint([
                                loseFate({ target: context.player, spend: true }),
                                cardLastingEffect(() => ({
                                    effect: doesNotBow(),
                                    target: context.target
                                }))
                            ])
                        })
                    );
                }

                return gameActions;
            }))
            .chatText('discard all status tokens from {0} at the end of the conflict');
    }
}


export default SurgingWave;
