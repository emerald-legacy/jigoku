import { msg } from '../../../GameChat.js';
import { CardType, Players } from '../../../Constants.js';
import { modifyBothSkills } from '../../../effects.js';
import { moveToConflict, sendHome } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { controlsShugenja } from '../../controlsShugenja.js';

export default class WingsOfThePhoenix extends DrawCard {
    static id = 'wings-of-the-phoenix';

    setupCardAbilities() {
        this.action('Move a character')
            .condition((context) =>
                context.game.isDuringConflict() &&
                controlsShugenja(context.player))
            .target({
                cardType: CardType.Character,
                controller: Players.Self
            }, sendHome(), moveToConflict())
            .onAffinity('fire', {
                chatText: () => msg`give all participating enemies -1${'military'}/-1${'political'} until the end of the conflict`
            })
            .cardLastingEffect((context) => ({
                target: context.game.currentConflict?.getCharacters(context.player.opponent),
                effect: modifyBothSkills(-1)
            }));
    }
}
