import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Durations } from '../../Constants.js';

class RighteousDelegate extends DrawCard {
    static id = 'righteous-delegate';

    setupCardAbilities() {
        this.action({
            title: 'Weaken bushi, empower non-bushi',
            condition: (context) => context.source.isParticipating(),
            effect: 'give all participating bushi characters -1{1} / -1{2} and give all participating non-bushi characters +1{1} / +1{2}',
            effectArgs: () => ['military', 'political'],
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.cardLastingEffect((context) => {
                    const conflict = this.game.currentConflict;
                    if(!conflict) {
                        return { target: [], effect: AbilityDsl.effects.modifyBothSkills(1), duration: Durations.UntilEndOfConflict };
                    }
                    return {
                        target: conflict
                            .getCharacters(context.player)
                            .filter((card: any) => !card.hasTrait('bushi'))
                            .concat(
                                conflict
                                    .getCharacters(context.player.opponent)
                                    .filter((card: any) => !card.hasTrait('bushi'))
                            ),
                        effect: AbilityDsl.effects.modifyBothSkills(1),
                        duration: Durations.UntilEndOfConflict
                    };
                }),
                AbilityDsl.actions.cardLastingEffect((context) => {
                    const conflict = this.game.currentConflict;
                    if(!conflict) {
                        return { target: [], effect: AbilityDsl.effects.modifyBothSkills(-1), duration: Durations.UntilEndOfConflict };
                    }
                    return {
                        target: conflict
                            .getCharacters(context.player)
                            .filter((card: any) => card.hasTrait('bushi'))
                            .concat(
                                conflict
                                    .getCharacters(context.player.opponent)
                                    .filter((card: any) => card.hasTrait('bushi'))
                            ),
                        effect: AbilityDsl.effects.modifyBothSkills(-1),
                        duration: Durations.UntilEndOfConflict
                    };
                })
            ])
        });
    }
}


export default RighteousDelegate;
