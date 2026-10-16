describe('Northern Wall Sensei', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    role: 'keeper-of-air',
                    inPlay: [
                        'northern-wall-sensei',
                        { card: 'akodo-gunso', attachments: ['fine-katana'] },
                        'doji-whisperer',
                        { card: 'matsu-berserker', attachments: ['ornate-fan'] }
                    ]
                },
                player2: {
                    inPlay: [{ card: 'doji-challenger', attachments: ['fine-katana'] }],
                    hand: ['banzai']
                }
            });
            this.sensei = this.player1.findCardByName('northern-wall-sensei');
            this.gunso = this.player1.findCardByName('akodo-gunso');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.banzai = this.player2.findCardByName('banzai');
            this.noMoreActions();
        });

        it('should only target participating characters you control with an attachment', function() {
            this.initiateConflict({
                attackers: [this.sensei, this.gunso, this.whisperer],
                defenders: [this.challenger]
            });
            this.player2.pass();
            this.player1.clickCard(this.sensei);
            expect(this.player1).toHavePrompt('Northern Wall Sensei');
            expect(this.player1).toBeAbleToSelect(this.gunso);
            expect(this.player1).not.toBeAbleToSelect(this.sensei);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.berserker);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
        });

        it('should make the chosen character immune to events', function() {
            this.initiateConflict({
                attackers: [this.sensei, this.gunso, this.whisperer],
                defenders: [this.challenger]
            });
            this.player2.pass();
            this.player1.clickCard(this.sensei);
            this.player1.clickCard(this.gunso);
            expect(this.getChatLogs(3)).toContain('player1 uses Northern Wall Sensei to grant immunity to events to Akodo Gunsō');
            this.player2.clickCard(this.banzai);
            expect(this.player2).toHavePrompt('Banzai!');
            expect(this.player2).not.toBeAbleToSelect(this.gunso);
            expect(this.player2).toBeAbleToSelect(this.whisperer);
            expect(this.player2).toBeAbleToSelect(this.sensei);
        });

        it('should not be usable while it is not participating', function() {
            this.initiateConflict({
                attackers: [this.gunso],
                defenders: [this.challenger]
            });
            this.player2.pass();
            this.player1.clickCard(this.sensei);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });
    });
});
