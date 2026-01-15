import { CardTypes, Locations, TargetModes } from '../../../Constants';
import AbilityDsl = require('../../../abilitydsl');
import DrawCard = require('../../../drawcard');

export default class ABadDeath extends DrawCard {
    static id = 'a-bad-death';

    private getMil(card) {
        if(!card) {
            return 1;
        }

        let amountOfCards = card.printedMilitarySkill;
        if(card.hasTrait('berserker')) {
            amountOfCards = card.getMilitarySkill();
        }
        return amountOfCards;
    }

    public setupCardAbilities() {
        this.reaction({
            title: 'Sacrifice a character to discard a card',
            when: {
                afterConflict: (event, context) => event.conflict.loser === context.player && event.conflict.conflictType === 'military' && !!context.player.opponent
            },
            cost: AbilityDsl.costs.dishonorAndSacrifice({
                cardType: CardTypes.Character,
                cardCondition: (card: DrawCard) => card.isParticipating() && this.getMil(card) > 0
            }),
            gameAction: AbilityDsl.actions.multipleContext((context) => {
                const amountOfCards = this.getMil(context.costs.dishonorAndSacrificeStateWhenChosen);

                let cards =
                    context.player.opponent && amountOfCards
                        ? context.player.opponent.hand.shuffle().slice(0, amountOfCards)
                        : [context.source];
                return {
                    gameActions: [
                        AbilityDsl.actions.lookAt(() => ({
                            target: cards.sort((card: DrawCard) => card.name)
                        })),
                        AbilityDsl.actions.cardMenu((context) => ({
                            cards: cards.sort((card: DrawCard) => card.name),
                            targets: true,
                            message: '{0} chooses {1} to be discarded',
                            messageArgs: (card) => [context.player, card],
                            gameAction: AbilityDsl.actions.discardCard()
                        }))
                    ]
                };
            }),
            effect: 'look at {1} random card{3} in {2}\'s hand',
            effectArgs: (context) => [
                this.getMil(context.costs.dishonorAndSacrificeStateWhenChosen),
                context.player.opponent,
                this.getMil(context.costs.dishonorAndSacrificeStateWhenChosen) === 1 ? '' : 's'
            ]
        });
    }
}
