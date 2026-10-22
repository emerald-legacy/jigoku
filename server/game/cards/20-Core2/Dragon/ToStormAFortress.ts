import { msg } from '../../../GameChat.js';
import { CardType, Players, ConflictType, Trait } from '../../../Constants.js';
import { modifyMilitarySkill } from '../../../effects.js';
import { cardLastingEffect, discardCard, multiple, optional } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class ToStormAFortress extends DrawCard {
    static id = 'to-storm-a-fortress';

    public override setupCardAbilities() {
        this.conflictAction('Increase a character\'s military skill', { conflictType: ConflictType.Military })
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isParticipating() && card.hasSomeTrait(Trait.Bushi, Trait.Monk)
            }, multiple([
                cardLastingEffect({
                    effect: modifyMilitarySkill(2)
                }),
                optional((context) => {
                    const cardsToDiscard = context.game.requireConflict()
                        .getConflictProvinces()
                        .flatMap((province) => province.controller.getDynastyCardsInProvince(province.location));
                    return {
                        activePromptTitle: 'Discard each card in the attacked province?',
                        gameAction: discardCard({ target: cardsToDiscard }),
                        acceptMessage: () => msg`${context.player}'s ${context.source} discards ${cardsToDiscard}`
                    };
                })
            ]))
            .chatText((context) => msg`grant +2${'military'} to ${context.chatTarget()}`);
    }
}
