import DrawCard from '../../DrawCard.js';
import { CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class UjiakisOffer extends DrawCard {
    static id = 'ujiaki-s-offer';

    setupCardAbilities() {
        this.action({
            title: 'Place a fate on a participating character, bow it, move it home, and dishonor it',
            condition: context => context.game.isDuringConflict('political'),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card.isParticipating() && context.player.cardsInPlay.some((myCard: any) => (
                    myCard !== card && myCard.isParticipating() && (myCard.printedCost ?? 0) >= (card.printedCost ?? 0))),
                gameAction: AbilityDsl.actions.placeFate()
            },
            then: context => ({
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.bow({target: context?.target}),
                    AbilityDsl.actions.dishonor({target: context?.target}),
                    AbilityDsl.actions.sendHome({target: context?.target})
                ])
            }),
            effect: 'place a fate on {0} then bow, dishonor, and move them home.'
        });
    }
}

export default UjiakisOffer;
