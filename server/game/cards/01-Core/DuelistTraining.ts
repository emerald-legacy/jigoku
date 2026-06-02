import type AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { AbilityType, CardType, DuelType, Players } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import type { Duel } from '../../Duel.js';
import * as GameActions from '../../GameActions/GameActions.js';

class DuelistTraining extends DrawCard {
    static id = 'duelist-training';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.whileAttached({
            effect: ability.effects.gainAbility(AbilityType.Action, {
                title: 'Initiate a duel to bow',
                condition: (context: AbilityContext) => context.source.isParticipating(),
                printedAbility: false,
                target: {
                    cardType: CardType.Character,
                    controller: Players.Opponent,
                    cardCondition: (card: DrawCard) => card.isParticipating(),
                    gameAction: ability.actions.duel((context: AbilityContext) => ({
                        type: DuelType.Military,
                        challenger: context.source,
                        gameAction: (duel: Duel) => ability.actions.bow({ target: duel.loser }),
                        costHandler: (context: AbilityContext, prompt: any) => this.costHandler(context, prompt)
                    }))
                }
            })
        });
    }

    costHandler(context: AbilityContext, prompt: any) {
        let lowBidder = this.game.getFirstPlayer();
        if(!lowBidder || !lowBidder.opponent) {
            return;
        }
        let difference = lowBidder.honorBid - lowBidder.opponent.honorBid;
        if(difference < 0) {
            lowBidder = lowBidder.opponent;
            difference = -difference;
        } else if(difference === 0) {
            return;
        }
        if(lowBidder.hand.length < difference) {
            prompt.transferHonorAfterBid(context);
            return;
        }
        this.game.promptWithHandlerMenu(lowBidder, {
            activePromptTite: 'Difference in bids: ' + difference.toString(),
            source: this,
            choices: ['Pay with honor', 'Pay with cards'],
            handlers: [
                () => prompt.transferHonorAfterBid(context),
                () => GameActions.chosenDiscard({ amount: difference }).resolve(lowBidder, context)
            ]
        });
    }
}


export default DuelistTraining;
