import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class KaradaDistrict extends DrawCard {
    static id = 'karada-district';

    setupCardAbilities() {
        this.action('Take control of an attachment')
            .cost(AbilityDsl.costs.giveFateToOpponent(1))
            .target('target', {
                cardType: CardType.Attachment,
                cardCondition: (card, context) => Boolean(card.parentCharacter && card.parentCharacter.controller === context.player.opponent)
            })
            .gameAction(AbilityDsl.actions.ifAble((context) => ({
                ifAbleAction: AbilityDsl.actions.selectCard({
                    target: context.target,
                    cardType: CardType.Character,
                    controller: Players.Self,
                    gameAction: AbilityDsl.actions.attach({
                        attachment: context.target,
                        takeControl: true
                    }),
                    message: '{0} chooses to attach {1} to {2}',
                    messageArgs: (cards, player) => [player, context.target, cards]
                }),
                otherwiseAction: AbilityDsl.actions.discardFromPlay({ target: context.target })
            })));
    }
}


export default KaradaDistrict;
