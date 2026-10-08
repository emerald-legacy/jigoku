import DrawCard from '../../DrawCard.js';
import { Duration } from '../../Constants.js';
import { unlimitedPerConflict } from '../../AbilityLimit.js';
import { takeControl } from '../../effects.js';
import { handler, loseFate, placeFate } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';

class MercenaryCompany extends DrawCard {
    static id = 'mercenary-company';

    setupCardAbilities() {
        this.forcedReaction('Give control of this character')
            .when({
                afterConflict: (event, context) => !!context.player.opponent && event.conflict.loser === context.player && context.source.isParticipating()
                    && loseFate().canAffect(context.player.opponent, context)
                    && placeFate().canAffect(context.source, context)
            })
            .gameAction(handler({
                handler: context => {
                    const opponent = context.player.opponent;
                    const source = context.source;
                    if(!opponent || !source.isDrawCard()) {
                        return;
                    }
                    context.game.promptWithHandlerMenu(opponent, {
                        activePromptTitle: 'Place a fate on Mercenary Company to take control of it?',
                        source: context.source,
                        options: [
                            {
                                text: 'Yes',
                                handler: () => {
                                    placeFate({ origin: opponent }).resolve(source, context);
                                    context.game.queueSimpleStep(() => {
                                        context.source.lastingEffect({
                                            duration: Duration.Custom,
                                            effect: takeControl(opponent)
                                        });
                                        this.game.addMessage('{0} places a fate on and takes control of {1}', opponent, context.source);
                                    });
                                }
                            },
                            {
                                text: 'No',
                                handler: () => {
                                    this.game.addMessage('{0} chooses not to hire {1}', opponent, context.source);
                                }
                            }
                        ]
                    });
                }
            }))
            .chatText((context) => msg`let ${context.player.opponent} hire their services`)
            .limit(unlimitedPerConflict());
    }

}


export default MercenaryCompany;
