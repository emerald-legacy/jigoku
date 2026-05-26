import DrawCard from '../../drawcard.js';
import { Durations } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class MercenaryCompany extends DrawCard {
    static id = 'mercenary-company';

    setupCardAbilities() {
        this.forcedReaction({
            title: 'Give control of this character',
            when: {
                afterConflict: (event: any, context) => !!context.player.opponent && event.conflict.loser === context.player && context.source.isParticipating()
                    && AbilityDsl.actions.loseFate().canAffect(context.player.opponent, context)
                    && AbilityDsl.actions.placeFate().canAffect(context.source, context)
            },
            gameAction: AbilityDsl.actions.handler({
                handler: context => {
                    const opponent = context.player.opponent;
                    if(!opponent) {
                        return;
                    }
                    context.game.promptWithHandlerMenu(opponent, {
                        activePromptTitle: 'Place a fate on Mercenary Company to take control of it?',
                        source: context.source,
                        choices: ['Yes', 'No'],
                        handlers: [
                            () => {
                                opponent.modifyFate(-1);
                                context.source.modifyFate(1);
                                context.source.lastingEffect(() => ({
                                    duration: Durations.Custom,
                                    effect: AbilityDsl.effects.takeControl(opponent)
                                }));
                                this.game.addMessage('{0} places a fate on and takes control of {1}', opponent, context.source);
                            },
                            () => {
                                this.game.addMessage('{0} chooses not to hire {1}', opponent, context.source);
                            }
                        ]
                    });
                }
            }),
            effect: 'let {1} hire their services',
            effectArgs: context => [context.player.opponent] as any,
            limit: AbilityDsl.limit.unlimitedPerConflict()
        });
    }

}


export default MercenaryCompany;
