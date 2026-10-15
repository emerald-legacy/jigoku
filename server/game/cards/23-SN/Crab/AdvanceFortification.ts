import { msg } from '../../../GameChat.js';
import DrawCard from '../../../DrawCard.js';
import { perConflict } from '../../../AbilityLimit.js';
import { modifyBothSkills } from '../../../effects.js';

export default class AdvanceFortification extends DrawCard {
    static id = 'advance-fortification';

    setupCardAbilities() {
        this.action('Take an honor from your opponent or give skill bonus')
            .condition((context) => !!context.game.currentConflict && context.game.currentConflict.defendingPlayer === context.player && !context.player.getProvinceCardInProvince(context.source.location)?.isBroken)
            .if((context) => !!context.player.getProvinceCardInProvince(context.source.location)?.isConflictProvince())
                .cardLastingEffect((context) => ({
                    target: context.game.currentConflict?.getCharacters(context.player) ?? [],
                    effect: modifyBothSkills(1)
                }))
            .otherwise()
                .loseHonor((context) => ({ target: context.player.opponent }))
            .chatText((context) => context.player.getProvinceCardInProvince(context.source.location)?.isConflictProvince()
                ? msg`give defending characters +1/+1`
                : msg`make ${context.player.opponent}${' lose 1 honor'}`)
            .max(perConflict(1));
    }
}
