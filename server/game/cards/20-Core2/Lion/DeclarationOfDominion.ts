import { CardType, Players, TargetMode } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import { BattlefieldAttachment } from '../../BattlefieldAttachment.js';

export default class DeclarationOfDominion extends BattlefieldAttachment {
    static id = 'declaration-of-dominion';

    public setupCardAbilities() {
        super.setupCardAbilities();

        this.action('Gives Pride to chosen characters')
            .condition((context) => !!context.source.parentProvince?.isConflictProvince())
            .targetCards('myCard', {
                activePromptTitle: 'Choose a character on your side',
                mode: TargetMode.UpTo,
                numCards: 1,
                optional: true,
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isParticipating()
            }, AbilityDsl.actions.cardLastingEffect({
                effect: AbilityDsl.effects.addKeyword('pride')
            }))
            .targetCards('opponentsCard', {
                activePromptTitle: 'Choose a character on the enemy side',
                mode: TargetMode.UpTo,
                numCards: 1,
                optional: true,
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating()
            }, AbilityDsl.actions.cardLastingEffect({
                effect: AbilityDsl.effects.addKeyword('pride')
            }))
            .effect('give pride to {1}', (context) => [
                (context.targets.myCard ?? []).concat(
                    context.targets.opponentsCard ?? []
                )
            ]);
    }

    protected unbrokenOnly() {
        return false;
    }
}
