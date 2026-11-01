describe('Noble Sacrifice', function() {
    integration(function() {
        describe('when its cost is prevented', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 5,
                        inPlay: ['doji-challenger'],
                        hand: ['noble-sacrifice']
                    },
                    player2: {
                        inPlay: ['akodo-kaede', 'bayushi-liar']
                    }
                });
                this.challenger = this.player1.findCardByName('doji-challenger');
                this.sacrifice = this.player1.findCardByName('noble-sacrifice');
                this.kaede = this.player2.findCardByName('akodo-kaede');
                this.liar = this.player2.findCardByName('bayushi-liar');
                this.challenger.honor();
                this.liar.dishonor();
                this.kaede.fate = 1;
            });

            it('is still put into the discard pile', function() {
                this.player1.clickCard(this.sacrifice);
                this.player1.clickCard(this.liar);
                this.player1.clickCard(this.challenger);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                this.player2.clickCard(this.kaede);
                expect(this.challenger.location).toBe('play area');
                expect(this.liar.location).toBe('play area');
                expect(this.sacrifice.location).toBe('conflict discard pile');
                expect(this.player1.fate).toBe(4);
            });
        });

        describe('Noble Sacrifice\'s action', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 5,
                        inPlay: [
                            { card: 'doji-challenger', honor: 'honored' },
                            'kakita-asami',
                            { card: 'doji-whisperer', honor: 'dishonored' }
                        ],
                        hand: ['noble-sacrifice']
                    },
                    player2: {
                        inPlay: [
                            { card: 'bayushi-liar', honor: 'dishonored' },
                            { card: 'akodo-toturi', honor: 'honored' },
                            'doji-kuwanan'
                        ]
                    }
                });
                this.challenger = this.player1.findCardByName('doji-challenger');
                this.asami = this.player1.findCardByName('kakita-asami');
                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.sacrifice = this.player1.findCardByName('noble-sacrifice');
                this.liar = this.player2.findCardByName('bayushi-liar');
                this.toturi = this.player2.findCardByName('akodo-toturi');
                this.kuwanan = this.player2.findCardByName('doji-kuwanan');
            });

            it('can only choose a dishonored character', function() {
                this.player1.clickCard(this.sacrifice);
                expect(this.player1).toHavePrompt('Noble Sacrifice');
                expect(this.player1).toBeAbleToSelect(this.liar);
                expect(this.player1).toBeAbleToSelect(this.whisperer);
                expect(this.player1).not.toBeAbleToSelect(this.kuwanan);
                expect(this.player1).not.toBeAbleToSelect(this.toturi);
                expect(this.player1).not.toBeAbleToSelect(this.asami);
            });

            it('can only sacrifice an honored character you control', function() {
                this.player1.clickCard(this.sacrifice);
                this.player1.clickCard(this.liar);
                expect(this.player1).toBeAbleToSelect(this.challenger);
                expect(this.player1).not.toBeAbleToSelect(this.asami);
                expect(this.player1).not.toBeAbleToSelect(this.whisperer);
                expect(this.player1).not.toBeAbleToSelect(this.toturi);
            });

            it('sacrifices the honored character and discards the chosen dishonored character', function() {
                this.player1.clickCard(this.sacrifice);
                this.player1.clickCard(this.liar);
                this.player1.clickCard(this.challenger);
                expect(this.challenger.location).toBe('dynasty discard pile');
                expect(this.liar.location).toBe('dynasty discard pile');
                expect(this.sacrifice.location).toBe('conflict discard pile');
                expect(this.player1.fate).toBe(4);
                expect(this.player2).toHavePrompt('Action Window');
            });

            it('cannot be played without an honored character you control', function() {
                this.challenger.makeOrdinary();
                this.player1.clickCard(this.sacrifice);
                expect(this.sacrifice.location).toBe('hand');
                expect(this.player1.fate).toBe(5);
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.toturi.isHonored).toBe(true);
                expect(this.liar.isDishonored).toBe(true);
            });
        });
    });
});
