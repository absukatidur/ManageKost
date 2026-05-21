<script src="assets/js/api.js"></script>
  
  <?php if (!empty($extraJs)): ?>
    <?php foreach ((array)$extraJs as $js): ?>
      <script src="<?= $js ?>"></script>
    <?php endforeach; ?>
  <?php endif; ?>
  
  <script src="assets/js/app.js"></script>
</body>
</html>