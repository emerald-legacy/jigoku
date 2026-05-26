import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';
import { CardTypes, Locations } from '../../Constants.js';

class VengefulBerserker extends DrawCard {
    static id = 'vengeful-berserker';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction({
            title: 'Double military skill',
            when: {
                onCardLeavesPlay: (event: any, context) => {
                    const card = event.cardStateWhenLeftPlay;
                    return !!card && card.location === Locations.PlayArea && card.type === CardTypes.Character && card.controller === context.player && this.game.isDuringConflict();
                }
            },
            effect: 'double his military skill until the end of the conflict',
            gameAction: ability.actions.cardLastingEffect({ effect: ability.effects.modifyMilitarySkillMultiplier(2) })
        });
    }
}


export default VengefulBerserker;
