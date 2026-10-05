import { CardType, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
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
            }, AbilityDsl.actions.multiple([
                AbilityDsl.actions.sendHome(),
                AbilityDsl.actions.moveToConflict(),
                AbilityDsl.actions.onAffinity({
                    trait: 'fire',
                    gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                        target: context.game.currentConflict?.getCharacters(context.player.opponent),
                        effect: AbilityDsl.effects.modifyBothSkills(-1)
                    })),
                    effect: 'give all participating enemies -1{1}/-1{2} until the end of the conflict',
                    effectArgs: ['military', 'political']
                })
            ]));
    }
}
