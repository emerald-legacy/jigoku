describe('Breakthrough', function () {
    integration(function () {
        describe('Breakthrough', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['moto-horde', 'aggressive-moto'],
                        hand: ['breakthrough']
                    },
                    player2: {
                        inPlay: ['mirumoto-raitsugu'],
                        provinces: ['shameful-display', 'entrenched-position']
                    }
                });

                this.motoHorde = this.player1.findCardByName('moto-horde');
                this.aggressiveMoto = this.player1.findCardByName('aggressive-moto');
                this.breakthrough = this.player1.findCardByName('breakthrough');
                this.mirumotoRaitsugu = this.player2.findCardByName('mirumoto-raitsugu');
                this.shamefulDisplay = this.player2.provinces['province 1'].provinceCard;
                this.entrenchedPosition = this.player2.provinces['province 2'].provinceCard;
                this.noMoreActions();
            });

            it('should initiate the second conflict after breaking a province in the first one', function () {
                this.initiateConflict({
                    attackers: [this.motoHorde],
                    defenders: []
                });
                this.player2.pass();
                this.player1.pass();
                this.player1.clickPrompt('Yes');
                this.player1.clickPrompt('Gain 2 Honor');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.breakthrough);
                this.player1.clickCard(this.breakthrough);
                expect(this.player1).toHavePrompt('Initiate Conflict');
            });

            it('should still allow the opponent to use both their conflict opportunities', function() {
                this.initiateConflict({
                    attackers: [this.motoHorde],
                    ring: 'air',
                    type: 'military',
                    defenders: [],
                    province: this.shamefulDisplay
                });
                this.player2.pass();
                this.player1.pass();
                this.player1.clickPrompt('Yes');
                this.player1.clickPrompt('Gain 2 Honor');
                this.player1.clickCard(this.breakthrough);
                this.initiateConflict({
                    attackers: [this.aggressiveMoto],
                    defenders: [],
                    ring: 'void',
                    type: 'political',
                    province: this.entrenchedPosition
                });
                this.noMoreActions();
                this.noMoreActions();
                expect(this.player2).toHavePrompt('Initiate Conflict');
                this.player2.passConflict();
                this.noMoreActions();
                expect(this.player2).toHavePrompt('Initiate Conflict');
            });

            it('should not trigger if there are no more valid attackers for the second conflict', function () {
                this.initiateConflict({
                    attackers: [this.motoHorde, this.aggressiveMoto],
                    defenders: []
                });
                this.player2.pass();
                this.player1.pass();
                this.player1.clickPrompt('Yes');
                this.player1.clickPrompt('Gain 2 Honor');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });

            it('should not trigger if it is not the first conflict this round', function () {
                this.player1.passConflict();
                this.noMoreActions();
                this.player2.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.motoHorde, this.aggressiveMoto],
                    defenders: []
                });
                this.player2.pass();
                this.player1.pass();
                this.player1.clickPrompt('Yes');
                this.player1.clickPrompt('Gain 2 Honor');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });

            it('should not trigger if the province was not broken', function () {
                this.initiateConflict({
                    attackers: [this.aggressiveMoto],
                    defenders: [this.mirumotoRaitsugu]
                });
                this.player2.pass();
                this.player1.pass();
                this.player1.clickPrompt('Gain 2 Honor');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });
        });

        describe('Waning Hostilities', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                        inPlay: ['moto-horde', 'aggressive-moto'],
                        hand: ['breakthrough']
                    },
                    player2: {
                        inPlay: ['mirumoto-raitsugu'],
                        hand: ['waning-hostilities']
                    }
                });
                this.player1.clickPrompt(1);
                this.player2.clickPrompt(2);

                this.motoHorde = this.player1.findCardByName('moto-horde');
                this.aggressiveMoto = this.player1.findCardByName('aggressive-moto');
                this.breakthrough = this.player1.findCardByName('breakthrough');
                this.mirumotoRaitsugu = this.player2.findCardByName('mirumoto-raitsugu');
                this.waningHostilities = this.player2.findCardByName('waning-hostilities');

                this.noMoreActions();
                this.player2.clickCard(this.waningHostilities);
                this.noMoreActions();
            });

            it('should prevent Breakthrough from triggering', function () {
                expect(this.player1.player.getConflictOpportunities()).toBe(1);
                expect(this.player2.player.getConflictOpportunities()).toBe(1);
                this.initiateConflict({
                    attackers: [this.motoHorde],
                    defenders: []
                });
                this.player2.pass();
                this.player1.pass();
                this.player1.clickPrompt('Yes');
                this.player1.clickPrompt('Gain 2 Honor');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });
        });
    });
});

describe('Breakthrough after a province broke outside conflict resolution', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer', 'aggressive-moto', 'moto-horde'],
                    hand: ['breakthrough']
                },
                player2: {
                    inPlay: ['mirumoto-raitsugu', 'doji-challenger'],
                    provinces: ['endless-plains']
                }
            });
            this.dojiWhisperer = this.player1.findCardByName('doji-whisperer');
            this.aggressiveMoto = this.player1.findCardByName('aggressive-moto');
            this.breakthrough = this.player1.findCardByName('breakthrough');
            this.raitsugu = this.player2.findCardByName('mirumoto-raitsugu');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.province = this.player2.findCardByName('endless-plains', 'province 1');
            this.noMoreActions();
        });

        it('triggers although the attacker lost the conflict (EmeraldDB ruling)', function () {
            this.initiateConflict({
                type: 'political',
                province: this.province,
                attackers: [this.dojiWhisperer, this.aggressiveMoto]
            });
            this.player2.clickCard(this.province);
            this.player1.clickPrompt('No');
            this.player1.clickCard(this.aggressiveMoto);
            expect(this.province.isBroken).toBe(true);
            expect(this.aggressiveMoto.location).toBe('dynasty discard pile');
            this.player2.assignDefenders([this.raitsugu, this.challenger]);

            this.player2.pass();
            this.player1.pass();
            expect(this.getChatLogs(10)).toContain('player2 won a political conflict 5 vs 3');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.breakthrough);
        });
    });
});

describe('Breakthrough after A War on Two Fronts', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 12,
                    inPlay: ['aggressive-moto', 'doji-whisperer'],
                    hand: ['a-war-on-two-fronts', 'breakthrough']
                },
                player2: {
                    honor: 10,
                    provinces: ['entrenched-position', 'shameful-display']
                }
            });
            this.moto = this.player1.findCardByName('aggressive-moto');
            this.war = this.player1.findCardByName('a-war-on-two-fronts');
            this.breakthrough = this.player1.findCardByName('breakthrough');
            this.entrenchedPosition = this.player2.findCardByName('entrenched-position');
            this.shamefulDisplay = this.player2.findCardByName('shameful-display', 'province 2');
            this.noMoreActions();
        });

        it('triggers when only the added province broke', function () {
            this.initiateConflict({
                attackers: [this.moto],
                type: 'military',
                ring: 'air',
                province: this.entrenchedPosition
            });
            this.player1.clickCard(this.war);
            this.player1.clickCard(this.shamefulDisplay);
            this.player2.clickPrompt('Done');
            this.player2.pass();
            this.player1.pass();
            this.player1.clickPrompt('Yes');
            this.player1.clickPrompt('Gain 2 Honor');
            expect(this.entrenchedPosition.isBroken).toBe(false);
            expect(this.shamefulDisplay.isBroken).toBe(true);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.breakthrough);
        });
    });
});

describe('Breakthrough copied by The Mirror\'s Gaze', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['moto-horde', 'aggressive-moto'],
                    hand: ['breakthrough']
                },
                player2: {
                    inPlay: ['asahina-storyteller', 'doji-whisperer'],
                    hand: ['the-mirror-s-gaze']
                }
            });
            this.motoHorde = this.player1.findCardByName('moto-horde');
            this.aggressiveMoto = this.player1.findCardByName('aggressive-moto');
            this.storyteller = this.player2.findCardByName('asahina-storyteller');
            this.player1.pass();
            this.mirror = this.player2.playAttachment('the-mirror-s-gaze', this.storyteller);
            this.noMoreActions();
        });

        it('isn\'t offered to a player who hasn\'t declared exactly one conflict (developer ruling)', function () {
            this.initiateConflict({
                attackers: [this.motoHorde],
                defenders: []
            });
            this.player2.pass();
            this.player1.pass();
            this.player1.clickPrompt('Yes');
            this.player1.clickPrompt('Gain 2 Honor');
            this.player1.clickCard('breakthrough');
            expect(this.player1).toHavePrompt('Initiate Conflict');
            this.initiateConflict({
                type: 'political',
                ring: 'void',
                province: this.player2.findCardByName('shameful-display', 'province 2'),
                attackers: [this.aggressiveMoto],
                defenders: []
            });
            this.player2.pass();
            this.player1.pass();
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).not.toBeAbleToSelect(this.mirror);
        });
    });
});

describe('Breakthrough copied by a player who passed their first conflict', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['asahina-storyteller'],
                    hand: ['the-mirror-s-gaze']
                },
                player2: {
                    inPlay: ['moto-horde', 'aggressive-moto'],
                    hand: ['breakthrough']
                }
            });
            this.storyteller = this.player1.findCardByName('asahina-storyteller');
            this.motoHorde = this.player2.findCardByName('moto-horde');
            this.mirror = this.player1.playAttachment('the-mirror-s-gaze', this.storyteller);
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
        });

        it('may copy it: they passed exactly one conflict (EmeraldDB ruling)', function () {
            this.initiateConflict({
                attackers: [this.motoHorde],
                defenders: []
            });
            this.player1.pass();
            this.player2.pass();
            this.player2.clickPrompt('Yes');
            this.player2.clickPrompt('Gain 2 Honor');
            this.player2.clickCard('breakthrough');
            this.initiateConflict({
                type: 'political',
                ring: 'void',
                province: this.player1.findCardByName('shameful-display', 'province 2'),
                attackers: ['aggressive-moto'],
                defenders: []
            });
            this.player1.pass();
            this.player2.pass();
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.mirror);
        });
    });
});
