import AbilityDsl from '../../../abilitydsl.js';
import { CardType, Players, TargetMode } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';

const CHARACTER = 'character';

function theTarget(context: TriggeredAbilityContext) {
    return { target: context.targets[CHARACTER] };
}

export default class InsufferableScallywag extends DrawCard {
    static id = 'insufferable-scallywag';

    public setupCardAbilities() {
        this.action({
            title: 'Dishonor or send a character home',
            condition: (context) => context.source.isParticipating(),
            cost: AbilityDsl.costs.removeFateFromSelf(),
            targets: {
                [CHARACTER]: {
                    cardType: CardType.Character,
                    controller: Players.Opponent,
                    cardCondition: (card: DrawCard, context) =>
                        card.glory > context.source.glory && card.isParticipating()
                },
                select: {
                    dependsOn: CHARACTER,
                    mode: TargetMode.Select,
                    player: Players.Opponent,
                    choices: {
                        'Dishonor this character': AbilityDsl.actions.dishonor(theTarget),
                        'Move this character home': AbilityDsl.actions.sendHome(theTarget)
                    }
                }
            }
        });
    }
}
