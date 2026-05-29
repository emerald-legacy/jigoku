import { CardTypes, ConflictTypes, Durations, Players, TargetModes } from '../../../Constants.js';
import type { TriggeredAbilityContext } from "../../../TriggeredAbilityContext.js";
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';

export default class ShosuroTechnique extends DrawCard {
    static id = 'shosuro-technique';

    setupCardAbilities() {
        this.duelChallenge({
            title: 'Apply status tokens to the duel',
            duelCondition: (duel, context) => duel.challengingPlayer && duel.challengingPlayer.opponent === context.player,
            gameAction: AbilityDsl.actions.duelLastingEffect((context) => ({
                target: (context as TriggeredAbilityContext).event.duel,
                effect: AbilityDsl.effects.duelIgnorePrintedSkill(),
                duration: Durations.UntilEndOfDuel
            })),
            effect: 'ignore printed skill when resolving this duel'
        });

        this.action({
            title: 'Set shinobi\'s skills to that of an enemy',
            condition: (context) => context.game.isDuringConflict(ConflictTypes.Military),
            targets: {
                shinobi: {
                    activePromptTitle: 'Choose a Shinobi you control',
                    mode: TargetModes.Single,
                    cardType: CardTypes.Character,
                    controller: Players.Self,
                    optional: false,
                    cardCondition: (card) => card.hasTrait('shinobi') && card.isParticipating()
                },
                enemy: {
                    mode: TargetModes.Single,
                    dependsOn: 'shinobi',
                    controller: Players.Opponent,
                    cardType: CardTypes.Character,
                    optional: false,
                    cardCondition: (card) => card.isParticipating()
                }
            },
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.cardLastingEffect((context) => ({
                    duration: Durations.UntilEndOfConflict,
                    target: context.targets.shinobi,
                    effect: AbilityDsl.effects.setMilitarySkill(context.targets.enemy.militarySkill)
                }))
            ]),
            effect: 'set the {3} of {1} to {4}{3} (equal to {2}). There\'s no blade as keen as surprise.',
            effectArgs: (context) => [(context.targets.shinobi as DrawCard).name, (context.targets.enemy as DrawCard).name, 'military', (context.targets.enemy as DrawCard).militarySkill]
        });
    }
}
