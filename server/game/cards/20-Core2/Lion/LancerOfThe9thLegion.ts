import { CardType, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class LancerOfThe9thLegion extends DrawCard {
    static id = 'lancer-of-the-9th-legion';

    setupCardAbilities() {
        this.action({
            title: 'Bow a character',
            condition: (context) => context.source.isParticipating('military'),
            target: {
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) =>
                    card.isParticipating() && card.getMilitarySkill() <= context.source.getMilitarySkill(),
                gameAction: AbilityDsl.actions.bow()
            }
        });
    }
}
