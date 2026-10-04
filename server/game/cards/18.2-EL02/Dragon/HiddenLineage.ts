import DrawCard from '../../../DrawCard.js';
import { Players, CardType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';

class HiddenLineage extends DrawCard {
    static id = 'hidden-lineage';

    setupCardAbilities() {
        this.action('Move an attachment')
            .target('target', {
                cardType: CardType.Attachment,
                controller: Players.Any,
                cardCondition: (card, context) => card.parentCharacter?.controller === context.player
            }, AbilityDsl.actions.selectCard((context) => ({
                cardType: CardType.Character,
                cardCondition: card => card !== context.target.parentCharacter && card.controller === context.player,
                message: '{0} moves {1} to {2}',
                messageArgs: card => [context.player, context.target, card],
                gameAction: AbilityDsl.actions.ifAble({
                    ifAbleAction: AbilityDsl.actions.attach({
                        attachment: context.target
                    }),
                    otherwiseAction: AbilityDsl.actions.discardFromPlay({ target: context.target })
                })
            })))
            .effect('move {0} to another character they control');
    }
}


export default HiddenLineage;
