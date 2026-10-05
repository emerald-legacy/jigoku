import type { AbilityContext } from '../../../AbilityContext.js';
import { Location, CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class KaiuScout extends DrawCard {
    static id = 'kaiu-scout';

    setupCardAbilities() {
        this.action('Look at cards in a province')
            .target({
                location: Location.Provinces,
                cardType: CardType.Province,
                cardCondition: card => card.controller.getDynastyCardsInProvince(card.location).filter(a => a.isFacedown()).length > 0
            })
            .gameAction(AbilityDsl.actions.handler({
                handler: (context) => {
                    const cards = context.target.controller.getDynastyCardsInProvince(context.target.location);
                    this.chooseCardsToTurnFaceup(context, cards.filter(a => a.isFacedown()));
                }
            }))
            .effect('look at facedown dynasty cards in {1}', context => [context.target.isFacedown() ? context.target.location : context.target])
            .evenDuringDynasty();
    };

    private chooseCardsToTurnFaceup(context: AbilityContext, facedownCards: DrawCard[]) {
        let remaining = facedownCards;
        const chosen: DrawCard[] = [];

        const turnFaceup = () => {
            if(chosen.length > 0) {
                this.game.addMessage('{0} turns {1} faceup', context.player, chosen);
                context.game.applyGameAction(context, { flipDynasty: chosen });
            } else {
                this.game.addMessage('{0} does not turn any cards faceup', context.player);
            }
        };
        const chooseCard = () => {
            this.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Select a card to turn faceup',
                context: context,
                cards: remaining,
                cardHandler: (card) => {
                    chosen.push(card);
                    remaining = remaining.filter((a) => a !== card);
                    if(remaining.length > 0) {
                        chooseCard();
                    } else {
                        turnFaceup();
                    }
                },
                options: [{ text: 'Done', handler: turnFaceup }]
            });
        };

        if(remaining.length > 0) {
            chooseCard();
        }
    }
}
