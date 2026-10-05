import DrawCard from '../../DrawCard.js';
import { Phases } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class HiddenMountainPass extends DrawCard {
    static id = 'hidden-mountain-pass';

    setupCardAbilities() {
        this.interrupt('Flip this holding\'s province facedown')
            .when({
                onPhaseEnded: (event, context) => event.phase === Phases.Conflict && !context.player.getProvinceCardInProvince(context.source.location)?.isBroken
            })
            .gameAction(AbilityDsl.actions.turnFacedown(context => ({
                target: context.player.getProvinceCardInProvince(context.source.location)
            })))
            .effect('turn {1} facedown', context => context.player.getProvinceCardInProvince(context.source.location));
    }
}


export default HiddenMountainPass;
