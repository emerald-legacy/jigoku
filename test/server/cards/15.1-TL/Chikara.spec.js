import { ResolvableAbility } from '../../../../build/server/game/ResolvableAbility.js';
import { takeControl } from '../../../../build/server/game/GameActions/GameActions.js';

describe('Chikara', function() {
    integration(function() {
        describe('Chikara attachment', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 3,
                        inPlay: ['hida-kisada', 'brash-samurai', 'hida-o-ushi', 'yoritomo'],
                        hand: ['chikara', 'seal-of-the-crab']
                    },
                    player2: {
                        inPlay: ['hida-kisada', 'doji-challenger'],
                        hand: ['let-go'],
                        dynastyDiscard: ['daidoji-netsu']
                    }
                });
                this.kisadaP1 = this.player1.findCardByName('hida-kisada');
                this.brashSamurai = this.player1.findCardByName('brash-samurai');
                this.oushi = this.player1.findCardByName('hida-o-ushi');
                this.yoritomo = this.player1.findCardByName('yoritomo');
                this.chikara = this.player1.findCardByName('chikara');
                this.seal = this.player1.findCardByName('seal-of-the-crab');

                this.kisadaP2 = this.player2.findCardByName('hida-kisada');
                this.challenger = this.player2.findCardByName('doji-challenger');
                this.letGo = this.player2.findCardByName('let-go');
                this.netsu = this.player2.findCardByName('daidoji-netsu');
            });

            it('should only be able to attach to unique crab characters', function() {
                this.player1.clickCard(this.chikara);
                expect(this.player1).toBeAbleToSelect(this.kisadaP1);
                expect(this.player1).toBeAbleToSelect(this.kisadaP2);
                expect(this.player1).not.toBeAbleToSelect(this.brashSamurai);
                expect(this.player1).toBeAbleToSelect(this.oushi);
                expect(this.player1).not.toBeAbleToSelect(this.yoritomo);
            });

            it('should grant the ability to a character that is a champion when attached', function() {
                const actionCount = this.kisadaP1.getReactions().length;
                this.player1.playAttachment(this.chikara, this.kisadaP1);
                expect(this.player2).toHavePrompt('Action Window');
                expect(this.kisadaP1.getReactions().length).toBe(actionCount + 1);
            });

            it('should not grant an ability to a character that is not a champion when attached', function() {
                const actionCount = this.oushi.getReactions().length;
                this.player1.playAttachment(this.chikara, this.oushi);
                expect(this.player2).toHavePrompt('Action Window');
                expect(this.oushi.getReactions().length).toBe(actionCount);
            });

            describe('unique non-crab character with the seal attached', function() {
                beforeEach(function () {
                    this.player1.playAttachment(this.seal, this.yoritomo);
                    this.player2.pass();
                });

                it('should attach', function() {
                    this.player1.clickCard(this.chikara);
                    expect(this.player1).toBeAbleToSelect(this.yoritomo);
                });

                it('should grant the ability if the character is a champion', function() {
                    const actionCount = this.yoritomo.getReactions().length;
                    this.player1.playAttachment(this.chikara, this.yoritomo);
                    expect(this.yoritomo.getReactions().length).toBe(actionCount + 1);
                });

                it('should discard if the character loses faction', function() {
                    this.player1.playAttachment(this.chikara, this.yoritomo);
                    this.player2.clickCard(this.letGo);
                    this.player2.clickCard(this.seal);
                    expect(this.chikara.location).toBe('conflict discard pile');
                });
            });

            describe('ability', function () {
                beforeEach(function () {
                    this.player1.playAttachment(this.chikara, this.kisadaP1);
                    this.noMoreActions();

                    this.kisadaP2.fate = 5;
                    this.kisadaP1.fate = 4;
                    this.oushi.fate = 2;
                    this.yoritomo.fate = 0;
                });

                it('should trigger when holder wins a conflict & ability should not be on sword', function() {
                    this.initiateConflict({
                        type: 'military',
                        attackers: [this.kisadaP1, this.oushi, this.yoritomo],
                        defenders: [this.kisadaP2]
                    });
                    this.noMoreActions();
                    expect(this.player1).toHavePrompt('Triggered Abilities');
                    expect(this.player1).toBeAbleToSelect(this.kisadaP1);
                    expect(this.player1).not.toBeAbleToSelect(this.chikara);
                });

                it('should not trigger if holder is not participating', function() {
                    this.initiateConflict({
                        type: 'military',
                        attackers: [this.oushi, this.yoritomo],
                        defenders: [this.kisadaP2]
                    });
                    this.noMoreActions();
                    expect(this.player1).not.toHavePrompt('Triggered Abilities');
                    expect(this.getChatLogs(5)).toContain('player1 won a military conflict 7 vs 7');
                });

                it('should let you choose a participating character', function() {
                    this.initiateConflict({
                        type: 'military',
                        attackers: [this.kisadaP1, this.oushi, this.yoritomo],
                        defenders: [this.kisadaP2]
                    });
                    this.noMoreActions();
                    this.player1.clickCard(this.kisadaP1);
                    expect(this.player1).toBeAbleToSelect(this.kisadaP1);
                    expect(this.player1).toBeAbleToSelect(this.oushi);
                    expect(this.player1).toBeAbleToSelect(this.yoritomo);
                    expect(this.player1).toBeAbleToSelect(this.kisadaP2);
                    expect(this.player1).not.toBeAbleToSelect(this.brashSamurai);
                    expect(this.player1).not.toBeAbleToSelect(this.challenger);
                });

                it('should return fate and sacrifice character', function() {
                    this.initiateConflict({
                        type: 'military',
                        attackers: [this.kisadaP1, this.oushi, this.yoritomo],
                        defenders: [this.kisadaP2]
                    });

                    const p1Fate = this.player1.fate;
                    const p2Fate = this.player2.fate;
                    const targetFate = this.kisadaP2.fate;

                    this.noMoreActions();
                    this.player1.clickCard(this.kisadaP1);
                    this.player1.clickCard(this.kisadaP2);

                    expect(this.player1.fate).toBe(p1Fate);
                    expect(this.player2.fate).toBe(p2Fate + targetFate);
                    expect(this.kisadaP2.location).toBe('dynasty discard pile');
                    expect(this.getChatLogs(5)).toContain('player1 uses Hida Kisada\'s gained ability from Chikara to force player2 to sacrifice Hida Kisada, returning all its fate to player2\'s fate pool');
                });

                it('should return fate and sacrifice character (self)', function() {
                    this.initiateConflict({
                        type: 'military',
                        attackers: [this.kisadaP1, this.oushi, this.yoritomo],
                        defenders: [this.kisadaP2]
                    });

                    const p1Fate = this.player1.fate;
                    const p2Fate = this.player2.fate;
                    const targetFate = this.kisadaP1.fate;

                    this.noMoreActions();
                    this.player1.clickCard(this.kisadaP1);
                    this.player1.clickCard(this.kisadaP1);

                    expect(this.player1.fate).toBe(p1Fate + targetFate);
                    expect(this.player2.fate).toBe(p2Fate);
                    expect(this.kisadaP1.location).toBe('dynasty discard pile');
                    expect(this.getChatLogs(5)).toContain('player1 uses Hida Kisada\'s gained ability from Chikara to force player1 to sacrifice Hida Kisada, returning all its fate to player1\'s fate pool');
                });

                it('should return fate even if it can\'t sacrifice', function() {
                    this.player2.moveCard(this.netsu, 'play area');
                    this.initiateConflict({
                        type: 'military',
                        attackers: [this.kisadaP1, this.oushi, this.yoritomo],
                        defenders: [this.kisadaP2]
                    });

                    const p1Fate = this.player1.fate;
                    const p2Fate = this.player2.fate;
                    const targetFate = this.kisadaP1.fate;

                    this.noMoreActions();
                    this.player1.clickCard(this.kisadaP1);
                    this.player1.clickCard(this.kisadaP1);

                    expect(this.player1.fate).toBe(p1Fate + targetFate);
                    expect(this.player2.fate).toBe(p2Fate);
                    expect(this.kisadaP1.location).toBe('play area');
                    expect(this.getChatLogs(5)).toContain('player1 uses Hida Kisada\'s gained ability from Chikara to force player1 to sacrifice Hida Kisada, returning all its fate to player1\'s fate pool');
                });

                it('should sacrifice even if target has no fate', function() {
                    this.initiateConflict({
                        type: 'military',
                        attackers: [this.kisadaP1, this.oushi, this.yoritomo],
                        defenders: [this.kisadaP2]
                    });

                    const p1Fate = this.player1.fate;
                    const p2Fate = this.player2.fate;
                    const targetFate = this.yoritomo.fate;

                    this.noMoreActions();
                    this.player1.clickCard(this.kisadaP1);
                    this.player1.clickCard(this.yoritomo);

                    expect(this.player1.fate).toBe(p1Fate + targetFate);
                    expect(this.player2.fate).toBe(p2Fate);
                    expect(this.kisadaP1.location).toBe('play area');
                    expect(this.getChatLogs(5)).toContain('player1 uses Hida Kisada\'s gained ability from Chikara to force player1 to sacrifice Yoritomo, returning all its fate to player1\'s fate pool');
                });

                it('should not be able to target a character who cannot be sacrificed and has no fate', function() {
                    this.player2.moveCard(this.netsu, 'play area');
                    this.initiateConflict({
                        type: 'military',
                        attackers: [this.kisadaP1, this.oushi, this.yoritomo],
                        defenders: [this.kisadaP2]
                    });

                    this.noMoreActions();
                    this.player1.clickCard(this.kisadaP1);
                    expect(this.player1).toBeAbleToSelect(this.kisadaP1);
                    expect(this.player1).toBeAbleToSelect(this.oushi);
                    expect(this.player1).not.toBeAbleToSelect(this.yoritomo);
                });
            });
        });
    });
});

describe('Chikara on a character its owner does not control', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 3,
                    inPlay: ['hida-kisada', 'hida-o-ushi'],
                    hand: ['chikara']
                },
                player2: {
                    inPlay: ['hida-kisada', 'doji-challenger']
                }
            });
            this.kisadaP1 = this.player1.findCardByName('hida-kisada');
            this.oushi = this.player1.findCardByName('hida-o-ushi');
            this.chikara = this.player1.findCardByName('chikara');
            this.kisadaP2 = this.player2.findCardByName('hida-kisada');
            this.challenger = this.player2.findCardByName('doji-challenger');

            const context = new ResolvableAbility(this.kisadaP1, {}).createContext(this.player1.player);
            this.game.queueSimpleStep(() => takeControl().resolve(this.challenger, context));
            this.game.continue();

            this.player1.playAttachment(this.chikara, this.kisadaP1);
            this.noMoreActions();
            this.challenger.fate = 3;
        });

        it('returns the fate to the character\'s controller', function() {
            expect(this.challenger.controller).toBe(this.player1.player);
            this.initiateConflict({
                type: 'military',
                attackers: [this.kisadaP1, this.oushi, this.challenger],
                defenders: [this.kisadaP2]
            });

            const p1Fate = this.player1.fate;
            const p2Fate = this.player2.fate;
            this.noMoreActions();
            this.player1.clickCard(this.kisadaP1);
            this.player1.clickCard(this.challenger);

            expect(this.player1.fate).toBe(p1Fate + 3);
            expect(this.player2.fate).toBe(p2Fate);
        });
    });
});

describe('Chikara and In Harmony', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['hida-kisada'],
                    hand: ['chikara']
                },
                player2: {
                    inPlay: ['doji-challenger'],
                    hand: ['in-harmony']
                }
            });
            this.kisada = this.player1.findCardByName('hida-kisada');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.challenger.fate = 2;
            this.player1.playAttachment('chikara', this.kisada);
            this.player2.claimRing('void');
            this.player2.playAttachment('in-harmony', this.challenger);
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.kisada],
                defenders: [this.challenger]
            });
            this.noMoreActions();
        });

        it('cannot choose a character whose fate cannot be moved', function() {
            this.player1.clickCard(this.kisada);
            expect(this.player1).toBeAbleToSelect(this.kisada);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            expect(this.challenger.fate).toBe(2);
            expect(this.challenger.location).toBe('play area');
        });
    });
});
