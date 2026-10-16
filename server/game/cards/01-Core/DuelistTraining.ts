import { bow, duel } from '../../GameActions/GameActions.js';
import { gainAbility } from '../../effects.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { CardType, DuelType, Players } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import { HonorBidPrompt } from '../../gamesteps/HonorBidPrompt.js';
import * as GameActions from '../../GameActions/GameActions.js';

class DuelistTraining extends DrawCard {
    static id = 'duelist-training';

    override setupCardAbilities() {
        this.whileAttached({
            effect: gainAbility.action('Initiate a duel to bow', (ability) => ability
                .condition((context) => context.source.isParticipating())
                .target({
                    cardType: CardType.Character,
                    controller: Players.Opponent,
                    cardCondition: (card) => card.isParticipating()
                }, duel({
                    type: DuelType.Military,
                    gameAction: (duel) => bow({ target: duel.loser }),
                    costHandler: (context, prompt) => {
                        if(prompt instanceof HonorBidPrompt) {
                            this.costHandler(context, prompt);
                        }
                    }
                })))
        });
    }

    private costHandler(context: AbilityContext, prompt: HonorBidPrompt) {
        let higherBidder = this.game.getFirstPlayer();
        if(!higherBidder || !higherBidder.opponent) {
            return;
        }
        let difference = higherBidder.honorBid - higherBidder.opponent.honorBid;
        if(difference < 0) {
            higherBidder = higherBidder.opponent;
            difference = -difference;
        } else if(difference === 0) {
            return;
        }
        if(higherBidder.hand.length < difference) {
            prompt.transferHonorAfterBid(context);
            return;
        }
        this.game.promptWithHandlerMenu(higherBidder, {
            activePromptTitle: 'Difference in bids: ' + difference.toString(),
            source: this,
            options: [
                { text: 'Pay with honor', handler: () => prompt.transferHonorAfterBid(context) },
                { text: 'Pay with cards', handler: () => GameActions.chosenDiscard({ amount: difference }).resolve(higherBidder, context) }
            ]
        });
    }
}


export default DuelistTraining;
