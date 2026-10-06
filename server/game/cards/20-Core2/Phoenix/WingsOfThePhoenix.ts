import { CardType, Players } from '../../../Constants.js';
import { modifyBothSkills } from '../../../effects.js';
import { cardLastingEffect, moveToConflict, multiple, onAffinity, sendHome } from '../../../GameActions/GameActions.js';
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
            }, multiple([
                sendHome(),
                moveToConflict(),
                onAffinity({
                    trait: 'fire',
                    gameAction: cardLastingEffect((context) => ({
                        target: context.game.currentConflict?.getCharacters(context.player.opponent),
                        effect: modifyBothSkills(-1)
                    })),
                    effect: 'give all participating enemies -1{1}/-1{2} until the end of the conflict',
                    effectArgs: ['military', 'political']
                })
            ]));
    }
}
