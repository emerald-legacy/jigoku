import DrawCard from '../../DrawCard.js';
import { Phase } from '../../Constants.js';
import { turnFacedown } from '../../GameActions/GameActions.js';

class HiddenMountainPass extends DrawCard {
    static id = 'hidden-mountain-pass';

    setupCardAbilities() {
        this.interrupt('Flip this holding\'s province facedown')
            .when({
                onPhaseEnded: (event, context) => event.phase === Phase.Conflict && !context.player.getProvinceCardInProvince(context.source.location)?.isBroken
            })
            .gameAction(turnFacedown(context => ({
                target: context.player.getProvinceCardInProvince(context.source.location)
            })))
            .chatText('turn {1} facedown', context => context.player.getProvinceCardInProvince(context.source.location));
    }
}


export default HiddenMountainPass;
