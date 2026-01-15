import AbilityDsl from '../../../abilitydsl';
import { TargetModes, Players, CardTypes, Locations, Durations } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class BayushiRumormonger extends DrawCard {
    static id = 'bayushi-rumormonger';

    public setupCardAbilities() {
        this.action({
            title: 'Discard the top card of your opponents conflict deck',
            gameAction: AbilityDsl.actions.discardCard(context => ({
                target: context.player.opponent ? context.player.opponent.conflictDeck.first() : []
            })),
            then: context => ({
                gameAction: AbilityDsl.actions.selectCard(({
                    activePromptTitle: 'Choose a character to dishonor',
                    targets: true,
                    optional: true,
                    cardType: CardTypes.Character,
                    controller: Players.Opponent,
                    cardCondition: card => {
                        const discardCard = (context.events as any)?.[0].cards?.[0];
                        if(!discardCard) {
                            return false;
                        }

                        const discardCost = discardCard.printedCost;
                        return card.printedCost <= discardCost;
                    },
                    message: '{0} dishonors {1}',
                    messageArgs: cards => [context.player, cards],
                    gameAction: AbilityDsl.actions.dishonor()
                }))
            }),
            effect: 'discard the top card of {1}\'s conflict deck',
            effectArgs: context => [context.player.opponent]
        });
    }
}
