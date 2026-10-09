import { modifyMilitarySkillMultiplier } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import { CardType, Location } from '../../Constants.js';

class VengefulBerserker extends DrawCard {
    static id = 'vengeful-berserker';

    setupCardAbilities() {
        this.reaction('Double military skill')
            .when({
                onCardLeavesPlay: (event, context) => {
                    const card = event.cardStateWhenLeftPlay;
                    return !!card && card.location === Location.PlayArea && card.type === CardType.Character && card.controller === context.player && this.game.isDuringConflict();
                }
            })
            .cardLastingEffect({ effect: modifyMilitarySkillMultiplier(2) })
            .chatText('double his military skill until the end of the conflict');
    }
}


export default VengefulBerserker;
